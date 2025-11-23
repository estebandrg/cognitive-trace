import { createClient } from '@/lib/supabase/server';
import { SessionsList } from '@/components/dashboard/sessions-list-simple';
import { redirect } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Target, Zap } from 'lucide-react';

// Revalidate every 30 seconds
export const revalidate = 30;

export default async function DashboardPage() {
	const supabase = await createClient();

	// Check authentication
	const { data: { user }, error: authError } = await supabase.auth.getUser();
	
	if (authError || !user) {
		redirect('/auth/login');
	}

	// Fetch data in parallel
	const [sessionsResult, statsResult] = await Promise.all([
		// Sessions with results
		supabase
			.from('sessions')
			.select(`
				*,
				test_results (
					id,
					test_type,
					accuracy,
					avg_reaction_time,
					duration
				)
			`)
			.order('start_time', { ascending: false })
			.limit(10),

		// User statistics
		supabase
			.from('user_statistics')
			.select('*')
			.single()
	]);

	// Handle errors
	if (sessionsResult.error) {
		console.error('Error fetching sessions:', sessionsResult.error);
	}

	const stats = statsResult.data;

	return (
		<div className="container mx-auto px-4 py-8">
			{/* Background gradients */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl" />
				<div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20 blur-3xl" />
			</div>

			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
					Mi Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-300">
					Historial y estadísticas de tus tests cognitivos
				</p>
			</div>

			{/* Statistics Cards */}
			{stats && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
					<StatsCard
						icon={<Brain className="w-6 h-6" />}
						title="Sesiones Totales"
						value={stats.total_sessions || 0}
						gradient="from-blue-500 to-purple-500"
					/>
					<StatsCard
						icon={<Target className="w-6 h-6" />}
						title="Precisión Promedio"
						value={`${stats.avg_accuracy?.toFixed(1) || 0}%`}
						gradient="from-green-500 to-blue-500"
					/>
					<StatsCard
						icon={<Zap className="w-6 h-6" />}
						title="Tests Completados"
						value={stats.total_tests_completed || 0}
						gradient="from-purple-500 to-pink-500"
					/>
				</div>
			)}

			{/* Sessions List */}
			<div>
				<h2 className="text-xl md:text-2xl font-semibold mb-4">
					Sesiones Recientes
				</h2>
				<SessionsList sessions={sessionsResult.data || []} />
			</div>
		</div>
	);
}

// Stats Card Component
interface StatsCardProps {
	icon: React.ReactNode;
	title: string;
	value: string | number;
	gradient: string;
}

function StatsCard({ icon, title, value, gradient }: StatsCardProps) {
	return (
		<Card className="relative overflow-hidden">
			<div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
			<CardContent className="p-6 relative">
				<div className="flex items-start justify-between">
					<div>
						<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
							{title}
						</p>
						<p className="text-3xl font-bold">
							{value}
						</p>
					</div>
					<div className={`p-3 rounded-full bg-gradient-to-br ${gradient} text-white`}>
						{icon}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
