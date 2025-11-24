'use client';

import { X, Calendar, Clock, Target, Zap, TrendingUp, TrendingDown, Brain, CheckCircle2, XCircle } from 'lucide-react';
import { format } from 'date-fns';

interface TestResult {
	id: string;
	test_type: string;
	accuracy: number;
	avg_reaction_time: number | null;
	duration: number;
	specific_metrics?: any;
}

interface SessionData {
	id: string;
	start_time: string;
	end_time: string | null;
	is_completed: boolean | null;
	is_sequential: boolean | null;
	total_tests_completed: number | null;
	test_results: TestResult[];
}

interface SessionDetailModalProps {
	session: SessionData | null;
	onClose: () => void;
	averageAccuracy: number;
	averageReactionTime: number;
	translations: {
		sessionDetails: string;
		sessionInfo: string;
		date: string;
		duration: string;
		type: string;
		sequential: string;
		individual: string;
		testsCompleted: string;
		overallPerformance: string;
		accuracy: string;
		reactionTime: string;
		testBreakdown: string;
		comparison: string;
		aboveAverage: string;
		belowAverage: string;
		onAverage: string;
		specificMetrics: string;
		close: string;
	};
}

export function SessionDetailModal({ session, onClose, averageAccuracy, averageReactionTime, translations }: SessionDetailModalProps) {
	if (!session) return null;

	const sessionDuration = session.end_time 
		? Math.round((new Date(session.end_time).getTime() - new Date(session.start_time).getTime()) / 1000 / 60)
		: 0;

	const sessionAccuracy = session.test_results.length > 0
		? Math.round(session.test_results.reduce((acc, r) => acc + r.accuracy, 0) / session.test_results.length)
		: 0;

	const sessionAvgRT = session.test_results.length > 0
		? Math.round(
			session.test_results
				.filter(r => r.avg_reaction_time !== null)
				.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) / 
			session.test_results.filter(r => r.avg_reaction_time !== null).length
		)
		: 0;

	const accuracyDiff = sessionAccuracy - averageAccuracy;
	const rtDiff = sessionAvgRT - averageReactionTime;

	const getTestIcon = (testType: string) => {
		const icons: Record<string, string> = {
			'sart': '🎯',
			'flanker': '➡️',
			'nback': '🧠',
			'pvt': '⚡'
		};
		return icons[testType.toLowerCase()] || '📊';
	};

	const getTestName = (testType: string) => {
		const names: Record<string, string> = {
			'sart': 'SART',
			'flanker': 'Flanker',
			'nback': 'N-Back',
			'pvt': 'PVT'
		};
		return names[testType.toLowerCase()] || testType.toUpperCase();
	};

	const getPerformanceColor = (accuracy: number) => {
		if (accuracy >= 85) return 'text-green-600 dark:text-green-400';
		if (accuracy >= 70) return 'text-blue-600 dark:text-blue-400';
		if (accuracy >= 50) return 'text-yellow-600 dark:text-yellow-400';
		return 'text-red-600 dark:text-red-400';
	};

	const getPerformanceGradient = (accuracy: number) => {
		if (accuracy >= 85) return 'from-green-500 to-emerald-600';
		if (accuracy >= 70) return 'from-blue-500 to-cyan-600';
		if (accuracy >= 50) return 'from-yellow-500 to-orange-600';
		return 'from-red-500 to-pink-600';
	};

	return (
		<>
			{/* Backdrop */}
			<div 
				className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div 
					className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-gray-200/50 bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-200 dark:border-gray-800/50 dark:bg-gray-900"
					onClick={(e) => e.stopPropagation()}
				>
					{/* Header */}
					<div className="relative overflow-hidden border-b border-gray-200/50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 dark:border-gray-800/50">
						<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
						<div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
						
						<div className="relative flex items-start justify-between">
							<div>
								<h2 className="text-2xl font-bold text-white">{translations.sessionDetails}</h2>
								<p className="mt-1 text-sm text-white/80">
									{format(new Date(session.start_time), 'MMMM dd, yyyy · HH:mm')}
								</p>
							</div>
							<button
								onClick={onClose}
								className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/20"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
						{/* Session Info Cards */}
						<div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/50 to-white p-4 dark:border-gray-800/50 dark:from-blue-900/10 dark:to-gray-900/50">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Calendar className="h-4 w-4" />
									{translations.date}
								</div>
								<p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
									{format(new Date(session.start_time), 'MMM dd')}
								</p>
							</div>

							<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-purple-50/50 to-white p-4 dark:border-gray-800/50 dark:from-purple-900/10 dark:to-gray-900/50">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Clock className="h-4 w-4" />
									{translations.duration}
								</div>
								<p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
									{sessionDuration} min
								</p>
							</div>

							<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-pink-50/50 to-white p-4 dark:border-gray-800/50 dark:from-pink-900/10 dark:to-gray-900/50">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<Brain className="h-4 w-4" />
									{translations.type}
								</div>
								<p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
									{session.is_sequential ? translations.sequential : translations.individual}
								</p>
							</div>

							<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-green-50/50 to-white p-4 dark:border-gray-800/50 dark:from-green-900/10 dark:to-gray-900/50">
								<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
									<CheckCircle2 className="h-4 w-4" />
									{translations.testsCompleted}
								</div>
								<p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
									{session.total_tests_completed || session.test_results.length}
								</p>
							</div>
						</div>

						{/* Overall Performance */}
						<div className="mb-6 rounded-xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
							<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
								<Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
								{translations.overallPerformance}
							</h3>

							<div className="grid gap-4 sm:grid-cols-2">
								{/* Accuracy */}
								<div>
									<div className="mb-2 flex items-center justify-between">
										<span className="text-sm text-gray-600 dark:text-gray-400">{translations.accuracy}</span>
										<span className={`text-2xl font-bold ${getPerformanceColor(sessionAccuracy)}`}>
											{sessionAccuracy}%
										</span>
									</div>
									<div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
										<div 
											className={`h-full rounded-full bg-gradient-to-r ${getPerformanceGradient(sessionAccuracy)} transition-all`}
											style={{ width: `${sessionAccuracy}%` }}
										/>
									</div>
									<div className="mt-2 flex items-center gap-1 text-xs">
										{accuracyDiff > 0 ? (
											<>
												<TrendingUp className="h-3 w-3 text-green-600" />
												<span className="text-green-600 dark:text-green-400">
													+{Math.abs(accuracyDiff)}% {translations.aboveAverage}
												</span>
											</>
										) : accuracyDiff < 0 ? (
											<>
												<TrendingDown className="h-3 w-3 text-red-600" />
												<span className="text-red-600 dark:text-red-400">
													{Math.abs(accuracyDiff)}% {translations.belowAverage}
												</span>
											</>
										) : (
											<span className="text-gray-600 dark:text-gray-400">{translations.onAverage}</span>
										)}
									</div>
								</div>

								{/* Reaction Time */}
								{sessionAvgRT > 0 && (
									<div>
										<div className="mb-2 flex items-center justify-between">
											<span className="text-sm text-gray-600 dark:text-gray-400">{translations.reactionTime}</span>
											<span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
												{sessionAvgRT}ms
											</span>
										</div>
										<div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
											<div 
												className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
												style={{ width: `${Math.min((1000 - sessionAvgRT) / 10, 100)}%` }}
											/>
										</div>
										<div className="mt-2 flex items-center gap-1 text-xs">
											{rtDiff < 0 ? (
												<>
													<TrendingUp className="h-3 w-3 text-green-600" />
													<span className="text-green-600 dark:text-green-400">
														{Math.abs(rtDiff)}ms faster
													</span>
												</>
											) : rtDiff > 0 ? (
												<>
													<TrendingDown className="h-3 w-3 text-red-600" />
													<span className="text-red-600 dark:text-red-400">
														+{Math.abs(rtDiff)}ms slower
													</span>
												</>
											) : (
												<span className="text-gray-600 dark:text-gray-400">{translations.onAverage}</span>
											)}
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Test Breakdown */}
						<div className="rounded-xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
							<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
								<Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
								{translations.testBreakdown}
							</h3>

							<div className="space-y-4">
								{session.test_results.map((test, index) => (
									<div 
										key={test.id}
										className="group rounded-lg border border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 p-4 transition-all hover:shadow-md dark:border-gray-800/50 dark:from-gray-900/50 dark:to-gray-800/50"
									>
										<div className="flex items-start justify-between">
											<div className="flex items-center gap-3">
												<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-xl shadow-md">
													{getTestIcon(test.test_type)}
												</div>
												<div>
													<h4 className="font-semibold text-gray-900 dark:text-white">
														{getTestName(test.test_type)}
													</h4>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{Math.round(test.duration / 60)} min · {test.accuracy}% accuracy
													</p>
												</div>
											</div>
											<div className="text-right">
												<div className={`text-2xl font-bold ${getPerformanceColor(test.accuracy)}`}>
													{test.accuracy}%
												</div>
												{test.avg_reaction_time && (
													<div className="text-sm text-gray-600 dark:text-gray-400">
														{test.avg_reaction_time}ms
													</div>
												)}
											</div>
										</div>

										{/* Specific Metrics */}
										{test.specific_metrics && (
											<div className="mt-3 grid grid-cols-2 gap-2 border-t border-gray-200/50 pt-3 text-xs dark:border-gray-800/50 sm:grid-cols-4">
												{Object.entries(test.specific_metrics).slice(0, 4).map(([key, value]) => (
													<div key={key} className="rounded bg-gray-100/50 p-2 dark:bg-gray-800/50">
														<div className="text-gray-500 dark:text-gray-400">{key}</div>
														<div className="mt-1 font-semibold text-gray-900 dark:text-white">
															{typeof value === 'number' ? value.toFixed(2) : String(value)}
														</div>
													</div>
												))}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
