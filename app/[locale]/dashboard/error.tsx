'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

/**
 * Error boundary para el dashboard
 * Se muestra si hay un error al cargar datos
 */
export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error('Dashboard error:', error);
	}, [error]);

	return (
		<div className="container mx-auto px-4 py-16">
			<div className="max-w-md mx-auto text-center">
				<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
				
				<h2 className="text-2xl font-bold mb-4">
					Error al cargar el dashboard
				</h2>
				
				<p className="text-gray-600 dark:text-gray-300 mb-6">
					{error.message || 'Ocurrió un error inesperado al cargar tus datos.'}
				</p>

				<div className="space-y-3">
					<Button onClick={reset} className="w-full">
						Reintentar
					</Button>
					
					<Button
						variant="outline"
						onClick={() => window.location.href = '/'}
						className="w-full"
					>
						Volver al inicio
					</Button>
				</div>

				{error.digest && (
					<p className="mt-6 text-xs text-gray-400">
						Error ID: {error.digest}
					</p>
				)}
			</div>
		</div>
	);
}
