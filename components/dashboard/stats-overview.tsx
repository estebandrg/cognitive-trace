import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Target, Zap, TrendingUp } from 'lucide-react';
import type { Database } from '@/lib/supabase/database.types';

type UserStats = Database['public']['Views']['user_statistics']['Row'];

interface StatsOverviewProps {
	stats: UserStats | null;
	translations: {
		totalSessions: string;
		avgAccuracy: string;
		testsCompleted: string;
		avgReactionTime: string;
	};
}

export function StatsOverview({ stats, translations }: StatsOverviewProps) {
	if (!stats) {
		return null;
	}

	const statsData = [
		{
			icon: <Brain className="w-6 h-6" />,
			title: translations.totalSessions,
			value: stats.total_sessions || 0,
			gradient: 'from-blue-500 to-purple-500',
			bgGradient: 'from-blue-500/10 to-purple-500/10',
		},
		{
			icon: <Target className="w-6 h-6" />,
			title: translations.avgAccuracy,
			value: `${stats.avg_accuracy?.toFixed(1) || 0}%`,
			gradient: 'from-green-500 to-blue-500',
			bgGradient: 'from-green-500/10 to-blue-500/10',
		},
		{
			icon: <Zap className="w-6 h-6" />,
			title: translations.testsCompleted,
			value: stats.total_tests_completed || 0,
			gradient: 'from-purple-500 to-pink-500',
			bgGradient: 'from-purple-500/10 to-pink-500/10',
		},
	];

	// Add reaction time if available
	if (stats.avg_reaction_time) {
		statsData.push({
			icon: <TrendingUp className="w-6 h-6" />,
			title: translations.avgReactionTime,
			value: `${stats.avg_reaction_time.toFixed(0)}ms`,
			gradient: 'from-orange-500 to-red-500',
			bgGradient: 'from-orange-500/10 to-red-500/10',
		});
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{statsData.map((stat, index) => (
				<Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
					{/* Background gradient */}
					<div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
					
					<CardContent className="p-6 relative">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									{stat.title}
								</p>
								<p className="text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent" 
									style={{
										backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
									}}>
									<span className={`bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
										{stat.value}
									</span>
								</p>
							</div>
							<div className={`p-3 rounded-full bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
								{stat.icon}
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
