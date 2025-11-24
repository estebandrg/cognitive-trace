/**
 * Loading UI para el dashboard
 * Se muestra mientras el Server Component fetch los datos
 */
export default function DashboardLoading() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="space-y-8">
				{/* Header skeleton */}
				<div className="space-y-2">
					<div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
					<div className="h-4 w-64 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
				</div>

				{/* Stats cards skeleton */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="h-32 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
						/>
					))}
				</div>

				{/* Sessions list skeleton */}
				<div className="space-y-4">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="h-40 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
