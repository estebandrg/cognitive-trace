'use client';

import { useMemo, lazy, Suspense } from 'react';
import { TrendingUp, TrendingDown, Minus, Target, Zap, Brain, Award, AlertCircle, Loader2 } from 'lucide-react';
import { format, subDays, startOfDay } from 'date-fns';

// Lazy load charts for performance
const AccuracyTrendChart = lazy(() => import('./trends-charts').then(m => ({ default: m.AccuracyTrendChart })));
const PerformanceRadarChart = lazy(() => import('./trends-charts').then(m => ({ default: m.PerformanceRadarChart })));
const WeeklyProgressChart = lazy(() => import('./trends-charts').then(m => ({ default: m.WeeklyProgressChart })));
const TestComparisonChart = lazy(() => import('./trends-charts').then(m => ({ default: m.TestComparisonChart })));

const ChartSkeleton = () => (
	<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
		<div className="mb-4 flex items-center gap-2">
			<div className="h-8 w-8 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
			<div className="h-6 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
		</div>
		<div className="flex h-[300px] items-center justify-center">
			<Loader2 className="h-8 w-8 animate-spin text-gray-400" />
		</div>
	</div>
);

interface SessionData {
	id: string;
	start_time: string;
	end_time: string | null;
	is_completed: boolean | null;
	test_results: Array<{
		id: string;
		test_type: string;
		accuracy: number;
		avg_reaction_time: number | null;
		duration: number;
		specific_metrics: any;
	}>;
}

interface TrendsViewProps {
	sessions: SessionData[];
	translations: {
		title: string;
		noData: string;
		overallTrend: string;
		improving: string;
		declining: string;
		stable: string;
		accuracyTrend: string;
		reactionTimeTrend: string;
		performanceRadar: string;
		weeklyProgress: string;
		testComparison: string;
		insights: string;
	};
}

export function TrendsView({ sessions, translations }: TrendsViewProps) {
	// Memoize completed sessions filter - filter by test results regardless of is_completed flag
	const completedSessions = useMemo(() => {
		return sessions.filter(s => s.test_results && s.test_results.length > 0);
	}, [sessions]);

	// Memoize helper functions
	const calcAvgAccuracy = useMemo(() => {
		return (sessions: SessionData[]) => {
			const allResults = sessions.flatMap(s => s.test_results);
			return allResults.length > 0
				? allResults.reduce((acc, r) => acc + r.accuracy, 0) / allResults.length
				: 0;
		};
	}, []);

	const calcAvgRT = useMemo(() => {
		return (sessions: SessionData[]) => {
			const validResults = sessions.flatMap(s => s.test_results).filter(r => r.avg_reaction_time);
			return validResults.length > 0
				? validResults.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) / validResults.length
				: 0;
		};
	}, []);

	// Memoize trend calculations
	const trendData = useMemo(() => {
		if (completedSessions.length < 2) return null;

		const midPoint = Math.floor(completedSessions.length / 2);
		const firstHalf = completedSessions.slice(0, midPoint);
		const secondHalf = completedSessions.slice(midPoint);

		const firstHalfAccuracy = calcAvgAccuracy(firstHalf);
		const secondHalfAccuracy = calcAvgAccuracy(secondHalf);
		const accuracyChange = secondHalfAccuracy - firstHalfAccuracy;

		const firstHalfRT = calcAvgRT(firstHalf);
		const secondHalfRT = calcAvgRT(secondHalf);
		const rtChange = firstHalfRT - secondHalfRT;

		const overallTrend = accuracyChange > 2 || rtChange > 20 ? 'improving' :
			accuracyChange < -2 || rtChange < -20 ? 'declining' : 'stable';

		return {
			accuracyChange,
			rtChange,
			overallTrend
		};
	}, [completedSessions, calcAvgAccuracy, calcAvgRT]);

	// Memoize timeline data
	const timelineData = useMemo(() => {
		return [...completedSessions]
			.reverse()
			.map((session, idx) => {
				const avgAccuracy = session.test_results.reduce((acc, r) => acc + r.accuracy, 0) / session.test_results.length;
				const validRT = session.test_results.filter(r => r.avg_reaction_time);
				const avgRT = validRT.length > 0
					? validRT.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) / validRT.length
					: null;

				return {
					session: `S${idx + 1}`,
					date: format(new Date(session.start_time), 'MMM dd'),
					accuracy: Math.round(avgAccuracy),
					rt: avgRT ? Math.round(avgRT) : null,
				};
			});
	}, [completedSessions]);

	// Memoize radar data
	const radarData = useMemo(() => {
		const testTypes = ['sart', 'flanker', 'nback', 'pvt'];
		return testTypes.map(testType => {
			const results = completedSessions
				.flatMap(s => s.test_results)
				.filter(r => r.test_type === testType);

			if (results.length === 0) return null;

			const avgAccuracy = results.reduce((acc, r) => acc + r.accuracy, 0) / results.length;

			return {
				test: testType.toUpperCase(),
				score: Math.round(avgAccuracy),
				fullMark: 100
			};
		}).filter(Boolean) as Array<{ test: string; score: number; fullMark: number }>;
	}, [completedSessions]);

	// Memoize weekly data
	const weeklyData = useMemo(() => {
		const data = [];
		for (let i = 0; i < 4; i++) {
			const weekStart = startOfDay(subDays(new Date(), i * 7));
			const weekEnd = startOfDay(subDays(new Date(), (i - 1) * 7));

			const weekSessions = completedSessions.filter(s => {
				const date = new Date(s.start_time);
				return date >= weekStart && date < weekEnd;
			});

			if (weekSessions.length > 0) {
				data.unshift({
					week: `Week ${4 - i}`,
					sessions: weekSessions.length,
					avgAccuracy: Math.round(calcAvgAccuracy(weekSessions)),
					avgRT: Math.round(calcAvgRT(weekSessions))
				});
			}
		}
		return data;
	}, [completedSessions, calcAvgAccuracy, calcAvgRT]);

	// Memoize test comparison
	const testComparison = useMemo(() => {
		const testTypes = ['sart', 'flanker', 'nback', 'pvt'];
		return testTypes.map(testType => {
			const allResults = completedSessions
				.flatMap(s => s.test_results)
				.filter(r => r.test_type === testType);

			if (allResults.length < 2) return null;

			const mid = Math.floor(allResults.length / 2);
			const early = allResults.slice(0, mid);
			const recent = allResults.slice(mid);

			const earlyAvg = early.reduce((acc, r) => acc + r.accuracy, 0) / early.length;
			const recentAvg = recent.reduce((acc, r) => acc + r.accuracy, 0) / recent.length;

			return {
				test: testType.toUpperCase(),
				early: Math.round(earlyAvg),
				recent: Math.round(recentAvg),
				change: Math.round(recentAvg - earlyAvg)
			};
		}).filter(Boolean) as Array<{ test: string; early: number; recent: number; change: number }>;
	}, [completedSessions]);

	if (completedSessions.length < 2) {
		return (
			<div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200/50 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
				<div className="text-center">
					<AlertCircle className="mx-auto h-16 w-16 text-gray-400" />
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
						{translations.noData}
					</p>
					<p className="mt-2 text-sm text-gray-500">
						Complete at least 2 sessions to see trend analysis
					</p>
				</div>
			</div>
		);
	}

	if (!trendData) return null;

	const { accuracyChange, rtChange, overallTrend } = trendData;

	return (
		<div className="space-y-6">
			{/* Header with overall trend */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
						{translations.title}
					</h1>
				</div>

				<div className={`flex items-center gap-2 rounded-lg px-4 py-2 ${
					overallTrend === 'improving'
						? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
						: overallTrend === 'declining'
						? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
						: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-300'
				}`}>
					{overallTrend === 'improving' ? (
						<TrendingUp className="h-5 w-5" />
					) : overallTrend === 'declining' ? (
						<TrendingDown className="h-5 w-5" />
					) : (
						<Minus className="h-5 w-5" />
					)}
					<span className="font-semibold">
						{overallTrend === 'improving'
							? translations.improving
							: overallTrend === 'declining'
							? translations.declining
							: translations.stable}
					</span>
				</div>
			</div>

			{/* Key Metrics Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/50 to-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:from-blue-900/10 dark:to-gray-900/50">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Accuracy Change</p>
							<p className="mt-1 text-2xl font-bold">
								{accuracyChange > 0 ? '+' : ''}{accuracyChange.toFixed(1)}%
							</p>
						</div>
						<Target className={`h-10 w-10 ${
							accuracyChange > 0 ? 'text-green-500' : accuracyChange < 0 ? 'text-red-500' : 'text-gray-400'
						}`} />
					</div>
				</div>

				<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-purple-50/50 to-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:from-purple-900/10 dark:to-gray-900/50">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Reaction Time</p>
							<p className="mt-1 text-2xl font-bold">
								{rtChange > 0 ? '-' : '+'}{Math.abs(rtChange).toFixed(0)}ms
							</p>
						</div>
						<Zap className={`h-10 w-10 ${
							rtChange > 0 ? 'text-green-500' : rtChange < 0 ? 'text-red-500' : 'text-gray-400'
						}`} />
					</div>
				</div>

				<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-pink-50/50 to-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:from-pink-900/10 dark:to-gray-900/50">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
							<p className="mt-1 text-2xl font-bold">{completedSessions.length}</p>
						</div>
						<Award className="h-10 w-10 text-pink-500" />
					</div>
				</div>
			</div>

			{/* Charts Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Suspense fallback={<ChartSkeleton />}>
					<AccuracyTrendChart data={timelineData} title={translations.accuracyTrend} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<PerformanceRadarChart data={radarData} title={translations.performanceRadar} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<WeeklyProgressChart data={weeklyData} title={translations.weeklyProgress} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<TestComparisonChart data={testComparison} title={translations.testComparison} />
				</Suspense>
			</div>

			{/* Insights */}
			<div className="rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10">
				<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
					<Brain className="h-5 w-5 text-purple-600" />
					{translations.insights}
				</h3>
				<div className="space-y-3">
					{accuracyChange > 5 && (
						<div className="flex items-start gap-3 rounded-lg bg-green-100/50 p-3 dark:bg-green-900/20">
							<TrendingUp className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
							<p className="text-sm">
								<strong>Great progress!</strong> Your accuracy has improved by {accuracyChange.toFixed(1)}% compared to earlier sessions.
							</p>
						</div>
					)}
					{rtChange > 50 && (
						<div className="flex items-start gap-3 rounded-lg bg-green-100/50 p-3 dark:bg-green-900/20">
							<Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
							<p className="text-sm">
								<strong>Faster reactions!</strong> Your average reaction time has decreased by {rtChange.toFixed(0)}ms, showing improved cognitive speed.
							</p>
						</div>
					)}
					{accuracyChange < -5 && (
						<div className="flex items-start gap-3 rounded-lg bg-yellow-100/50 p-3 dark:bg-yellow-900/20">
							<AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
							<p className="text-sm">
								<strong>Take your time.</strong> Accuracy has declined slightly. Consider focusing on accuracy over speed in your next session.
							</p>
						</div>
					)}
					{completedSessions.length >= 10 && (
						<div className="flex items-start gap-3 rounded-lg bg-blue-100/50 p-3 dark:bg-blue-900/20">
							<Award className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
							<p className="text-sm">
								<strong>Consistency milestone!</strong> You've completed {completedSessions.length} sessions. Regular practice is key to cognitive improvement.
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
