'use client';

import { useMemo, useState, memo, useCallback, lazy, Suspense } from 'react';
import { Calendar, Clock, Target, Zap, Brain, ChevronRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { SessionDetailModal } from './session-detail-modal';

// Lazy load charts for better performance
const AccuracyChart = lazy(() => import('./history-charts').then(m => ({ default: m.AccuracyChart })));
const ReactionTimeChart = lazy(() => import('./history-charts').then(m => ({ default: m.ReactionTimeChart })));
const TestDistributionChart = lazy(() => import('./history-charts').then(m => ({ default: m.TestDistributionChart })));
const PerformanceByTestChart = lazy(() => import('./history-charts').then(m => ({ default: m.PerformanceByTestChart })));

interface SessionData {
	id: string;
	start_time: string;
	end_time: string | null;
	is_completed: boolean | null;
	is_sequential: boolean | null;
	total_tests_completed: number | null;
	test_results: Array<{
		id: string;
		test_type: string;
		accuracy: number;
		avg_reaction_time: number | null;
		duration: number;
	}>;
}

interface HistoryViewProps {
	sessions: SessionData[];
	translations: {
		title: string;
		noSessions: string;
		sessionDate: string;
		testsCompleted: string;
		avgAccuracy: string;
		avgReactionTime: string;
		accuracyOverTime: string;
		reactionTimeOverTime: string;
		testDistribution: string;
		performanceByTest: string;
		sequential: string;
		individual: string;
		recentSessions: string;
		viewDetails: string;
		sessionDetails: string;
		sessionInfo: string;
		date: string;
		duration: string;
		type: string;
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

const testColors = {
	sart: '#3b82f6',
	flanker: '#10b981',
	nback: '#8b5cf6',
	pvt: '#f59e0b'
};

// Loading skeleton for charts
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

// Memoized session item component
const SessionItem = memo(function SessionItem({ 
	session, 
	onClick,
	translations 
}: { 
	session: SessionData; 
	onClick: () => void;
	translations: { sequential: string; individual: string };
}) {
	const avgAccuracy = session.test_results.length > 0
		? Math.round(
			session.test_results.reduce((acc, r) => acc + r.accuracy, 0) /
			session.test_results.length
		)
		: 0;

	const avgRT = session.test_results.filter(r => r.avg_reaction_time).length > 0
		? Math.round(
			session.test_results
				.filter(r => r.avg_reaction_time)
				.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) /
			session.test_results.filter(r => r.avg_reaction_time).length
		)
		: null;

	return (
		<button
			onClick={onClick}
			className="flex w-full flex-wrap items-center gap-4 rounded-lg border border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 p-4 text-left transition-all hover:scale-[1.01] hover:shadow-lg hover:border-blue-300 dark:border-gray-800/50 dark:from-gray-900/50 dark:to-gray-800/50 dark:hover:border-blue-700 group cursor-pointer"
		>
			<div className="flex items-center gap-2">
				<Calendar className="h-4 w-4 text-gray-500" />
				<span className="text-sm">
					{format(new Date(session.start_time), 'MMM dd, yyyy')}
				</span>
			</div>

			<div className="flex items-center gap-2">
				<Clock className="h-4 w-4 text-gray-500" />
				<span className="text-sm">
					{format(new Date(session.start_time), 'HH:mm')}
				</span>
			</div>

			<div className={`rounded-full px-3 py-1 text-xs font-medium ${
				session.is_sequential === true
					? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
					: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
			}`}>
				{session.is_sequential === true ? translations.sequential : translations.individual}
			</div>

			<div className="flex items-center gap-1 text-sm">
				<Target className="h-4 w-4 text-blue-600" />
				<span className="font-medium">{avgAccuracy}%</span>
			</div>

			{avgRT && (
				<div className="flex items-center gap-1 text-sm">
					<Zap className="h-4 w-4 text-purple-600" />
					<span className="font-medium">{avgRT}ms</span>
				</div>
			)}

			<div className="ml-auto flex items-center gap-2">
				<span className="text-sm text-gray-600 dark:text-gray-400">
					{session.total_tests_completed || 0} tests
				</span>
				<ChevronRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
			</div>
		</button>
	);
});

export function HistoryView({ sessions, translations }: HistoryViewProps) {
	const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);

	const handleSessionClick = useCallback((session: SessionData) => {
		setSelectedSession(session);
	}, []);

	// Calculate global averages for comparison
	const globalAverageAccuracy = useMemo(() => {
		const allResults = sessions.flatMap(s => s.test_results);
		if (allResults.length === 0) return 0;
		return Math.round(allResults.reduce((acc, r) => acc + r.accuracy, 0) / allResults.length);
	}, [sessions]);

	const globalAverageRT = useMemo(() => {
		const allResults = sessions.flatMap(s => s.test_results).filter(r => r.avg_reaction_time !== null);
		if (allResults.length === 0) return 0;
		return Math.round(allResults.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) / allResults.length);
	}, [sessions]);

	// Memoize expensive data calculations
	const accuracyData = useMemo(() => {
		return sessions
			.filter(s => s.test_results && s.test_results.length > 0)
			.reverse()
			.map((session, idx) => ({
				name: `S${idx + 1}`,
				date: format(new Date(session.start_time), 'MMM dd'),
				accuracy: session.test_results.length > 0
					? Math.round(
						session.test_results.reduce((acc, r) => acc + r.accuracy, 0) /
						session.test_results.length
					)
					: 0
			}));
	}, [sessions]);

	const reactionTimeData = useMemo(() => {
		return sessions
			.filter(s => s.test_results && s.test_results.length > 0)
			.reverse()
			.map((session, idx) => ({
				name: `S${idx + 1}`,
				date: format(new Date(session.start_time), 'MMM dd'),
				rt: session.test_results.length > 0
					? Math.round(
						session.test_results
							.filter(r => r.avg_reaction_time)
							.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) /
						session.test_results.filter(r => r.avg_reaction_time).length
					)
					: 0
			}));
	}, [sessions]);

	const testDistribution = useMemo(() => {
		return sessions
			.flatMap(s => s.test_results)
			.reduce((acc, result) => {
				const existing = acc.find(item => item.name === result.test_type);
				if (existing) {
					existing.value += 1;
				} else {
					acc.push({ name: result.test_type.toUpperCase(), value: 1 });
				}
				return acc;
			}, [] as Array<{ name: string; value: number }>);
	}, [sessions]);

	const performanceByTest = useMemo(() => {
		return Object.entries(testColors).map(([testType, color]) => {
			const results = sessions
				.flatMap(s => s.test_results)
				.filter(r => r.test_type === testType);

			if (results.length === 0) return null;

			return {
				test: testType.toUpperCase(),
				accuracy: Math.round(
					results.reduce((acc, r) => acc + r.accuracy, 0) / results.length
				),
				rt: Math.round(
					results
						.filter(r => r.avg_reaction_time)
						.reduce((acc, r) => acc + (r.avg_reaction_time || 0), 0) /
					results.filter(r => r.avg_reaction_time).length
				),
				color
			};
		}).filter(Boolean) as Array<{ test: string; accuracy: number; rt: number; color: string }>;
	}, [sessions]);

	if (sessions.length === 0) {
		return (
			<div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200/50 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
				<div className="text-center">
					<Brain className="mx-auto h-16 w-16 text-gray-400" />
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
						{translations.noSessions}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
					{translations.title}
				</h1>
			</div>

			{/* Charts Grid */}
			<div className="grid gap-6 lg:grid-cols-2">
				<Suspense fallback={<ChartSkeleton />}>
					<AccuracyChart data={accuracyData} title={translations.accuracyOverTime} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<ReactionTimeChart data={reactionTimeData} title={translations.reactionTimeOverTime} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<TestDistributionChart data={testDistribution} title={translations.testDistribution} />
				</Suspense>
				<Suspense fallback={<ChartSkeleton />}>
					<PerformanceByTestChart data={performanceByTest} title={translations.performanceByTest} />
				</Suspense>
			</div>

			{/* Sessions List */}
			<div className="rounded-xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
				<h3 className="mb-4 text-lg font-semibold">{translations.recentSessions}</h3>
				<div className="space-y-3">
					{sessions.slice(0, 10).map((session) => (
						<SessionItem
							key={session.id}
							session={session}
							onClick={() => handleSessionClick(session)}
							translations={{
								sequential: translations.sequential,
								individual: translations.individual
							}}
						/>
					))}
				</div>
			</div>

			{/* Session Detail Modal */}
			<SessionDetailModal
				session={selectedSession}
				onClose={() => setSelectedSession(null)}
				averageAccuracy={globalAverageAccuracy}
				averageReactionTime={globalAverageRT}
				translations={{
					sessionDetails: translations.sessionDetails,
					sessionInfo: translations.sessionInfo,
					date: translations.date,
					duration: translations.duration,
					type: translations.type,
					sequential: translations.sequential,
					individual: translations.individual,
					testsCompleted: translations.testsCompleted,
					overallPerformance: translations.overallPerformance,
					accuracy: translations.accuracy,
					reactionTime: translations.reactionTime,
					testBreakdown: translations.testBreakdown,
					comparison: translations.comparison,
					aboveAverage: translations.aboveAverage,
					belowAverage: translations.belowAverage,
					onAverage: translations.onAverage,
					specificMetrics: translations.specificMetrics,
					close: translations.close
				}}
			/>
		</div>
	);
}
