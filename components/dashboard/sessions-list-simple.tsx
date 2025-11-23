'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteSession } from '@/lib/actions/session-actions';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { Database } from '@/lib/supabase/database.types';

type Session = Database['public']['Tables']['sessions']['Row'];
type TestResult = Database['public']['Tables']['test_results']['Row'];

// Tipo extendido con relaciones
export type SessionWithResults = Session & {
	test_results?: Pick<TestResult, 'id' | 'test_type' | 'accuracy' | 'avg_reaction_time' | 'duration'>[];
};

interface SessionsListProps {
	sessions: SessionWithResults[];
}

/**
 * Componente simple de lista de sesiones
 * - Recibe datos como props desde Server Component
 * - Optimistic updates para mejor UX
 * - Revalidación con router.refresh()
 */
export function SessionsList({ sessions: initialSessions }: SessionsListProps) {
	const router = useRouter();
	const [sessions, setSessions] = useState(initialSessions);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const handleDelete = async (sessionId: string) => {
		if (!confirm('¿Estás seguro de eliminar esta sesión?')) return;

		setDeletingId(sessionId);

		// Optimistic update
		const backup = sessions;
		setSessions(sessions.filter(s => s.id !== sessionId));

		try {
			const response = await deleteSession(sessionId);
			
			if (!response.success) {
				throw new Error(response.error);
			}

			// Revalidar Server Component
			router.refresh();
		} catch (error) {
			console.error('Error deleting session:', error);
			// Rollback en caso de error
			setSessions(backup);
			alert('Error al eliminar la sesión');
		} finally {
			setDeletingId(null);
		}
	};

	const handleView = (sessionId: string) => {
		router.push(`/dashboard/sessions/${sessionId}`);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('es-ES', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const formatDuration = (start: string, end?: string | null) => {
		if (!end) return 'En progreso';
		const duration = new Date(end).getTime() - new Date(start).getTime();
		const minutes = Math.floor(duration / 60000);
		const seconds = Math.floor((duration % 60000) / 1000);
		return `${minutes}m ${seconds}s`;
	};

	if (sessions.length === 0) {
		return (
			<div className="text-center py-12">
				<Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-600 dark:text-gray-300">
					No hay sesiones registradas todavía
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{sessions.map((session) => (
				<div
					key={session.id}
					className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
				>
					<div className="flex items-start justify-between">
						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2">
								<h3 className="font-semibold text-lg">
									{session.is_sequential ? 'Evaluación Completa' : 'Tests Individuales'}
								</h3>
								{session.is_completed ? (
									<CheckCircle2 className="w-5 h-5 text-green-500" />
								) : (
									<Clock className="w-5 h-5 text-yellow-500" />
								)}
							</div>

							<div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
								<div className="flex items-center gap-1">
									<Calendar className="w-4 h-4" />
									{formatDate(session.start_time)}
								</div>
								<div className="flex items-center gap-1">
									<Clock className="w-4 h-4" />
									{formatDuration(session.start_time, session.end_time)}
								</div>
								<div>
									Tests: {session.total_tests_completed}/4
								</div>
							</div>

							{/* Resultados de tests */}
							{session.test_results && session.test_results.length > 0 && (
								<div className="mt-3 flex flex-wrap gap-2">
									{session.test_results.map((result) => (
										<div
											key={result.id}
											className="px-3 py-1 bg-blue-100 dark:bg-blue-900 rounded-full text-xs font-medium"
										>
											{result.test_type.toUpperCase()}: {result.accuracy?.toFixed(1)}%
										</div>
									))}
								</div>
							)}
						</div>

						<div className="flex gap-2 ml-4">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleView(session.id)}
							>
								<Eye className="w-4 h-4 mr-1" />
								Ver
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => handleDelete(session.id)}
								disabled={deletingId === session.id}
								className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
							>
								<Trash2 className="w-4 h-4 mr-1" />
								{deletingId === session.id ? 'Eliminando...' : 'Eliminar'}
							</Button>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
