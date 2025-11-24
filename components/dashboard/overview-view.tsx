'use client';

import { useMemo } from 'react';
import { Trophy, TrendingUp, Zap, Target, Calendar, Clock, Award, Brain, Activity, Flame, Star } from 'lucide-react';
import { format, differenceInDays, startOfDay } from 'date-fns';

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

interface OverviewViewProps {
	sessions: SessionData[];
	translations: {
		title: string;
		welcome: string;
		totalSessions: string;
		avgAccuracy: string;
		bestSession: string;
		currentStreak: string;
		days: string;
		testsCompleted: string;
		lastSession: string;
		recentActivity: string;
		topPerformance: string;
		quickStats: string;
		improvementRate: string;
		favoriteTest: string;
		noData: string;
	};
}

export function OverviewView({ sessions, translations }: OverviewViewProps) {
	// Memoize calculations
	const stats = useMemo(() => {
		// Filter sessions that have test results (regardless of is_completed flag)
		const completedSessions = sessions.filter(s => s.test_results && s.test_results.length > 0);
		
		if (completedSessions.length === 0) {
			return {
				totalSessions: 0,
				avgAccuracy: 0,
				totalTests: 0,
				bestAccuracy: 0,
				currentStreak: 0,
				lastSessionDate: null,
				improvementRate: 0,
				favoriteTest: null,
				recentSessions: [],
				testDistribution: {}
			};
		}

		// Calculate average accuracy
		const allResults = completedSessions.flatMap(s => s.test_results);
		const avgAccuracy = allResults.length > 0
			? allResults.reduce((acc, r) => acc + r.accuracy, 0) / allResults.length
			: 0;

		// Best session accuracy
		const bestAccuracy = Math.max(...completedSessions.map(s => {
			const results = s.test_results;
			return results.length > 0
				? results.reduce((acc, r) => acc + r.accuracy, 0) / results.length
				: 0;
		}));

		// Calculate streak
		const sortedSessions = [...completedSessions].sort((a, b) => 
			new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
		);
		
		let streak = 0;
		let currentDate = startOfDay(new Date());
		
		for (const session of sortedSessions) {
			const sessionDate = startOfDay(new Date(session.start_time));
			const daysDiff = differenceInDays(currentDate, sessionDate);
			
			if (daysDiff === streak) {
				streak++;
				currentDate = sessionDate;
			} else if (daysDiff > streak) {
				break;
			}
		}

		// Test distribution
		const testCounts = allResults.reduce((acc, r) => {
			acc[r.test_type] = (acc[r.test_type] || 0) + 1;
			return acc;
		}, {} as Record<string, number>);

		const favoriteTest = Object.entries(testCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

		// Improvement rate (compare first 3 vs last 3 sessions)
		let improvementRate = 0;
		if (completedSessions.length >= 6) {
			const first3 = completedSessions.slice(-3);
			const last3 = completedSessions.slice(0, 3);
			
			const first3Avg = first3.flatMap(s => s.test_results).reduce((acc, r) => acc + r.accuracy, 0) / 
				first3.flatMap(s => s.test_results).length;
			const last3Avg = last3.flatMap(s => s.test_results).reduce((acc, r) => acc + r.accuracy, 0) / 
				last3.flatMap(s => s.test_results).length;
			
			improvementRate = ((last3Avg - first3Avg) / first3Avg) * 100;
		}

		return {
			totalSessions: completedSessions.length,
			avgAccuracy: Math.round(avgAccuracy),
			totalTests: allResults.length,
			bestAccuracy: Math.round(bestAccuracy),
			currentStreak: streak,
			lastSessionDate: completedSessions[0]?.start_time,
			improvementRate: Math.round(improvementRate),
			favoriteTest: favoriteTest?.toUpperCase(),
			recentSessions: sortedSessions.slice(0, 5),
			testDistribution: testCounts
		};
	}, [sessions]);

	if (stats.totalSessions === 0) {
		return (
			<div className="flex min-h-[400px] items-center justify-center rounded-xl border border-gray-200/50 bg-white/50 p-8 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
				<div className="text-center">
					<Brain className="mx-auto h-16 w-16 text-gray-400" />
					<p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
						{translations.noData}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white shadow-xl">
				<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
				<div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
				<div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
				
				<div className="relative">
					<div className="mb-2 flex items-center gap-2">
						<Trophy className="h-6 w-6" />
						<span className="text-sm font-medium opacity-90">{translations.welcome}</span>
					</div>
					<h1 className="text-4xl font-bold">{translations.title}</h1>
					<p className="mt-2 text-lg opacity-90">
						{stats.totalSessions} {translations.totalSessions} · {stats.totalTests} {translations.testsCompleted}
					</p>
				</div>
			</div>

			{/* Key Metrics Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Average Accuracy */}
				<div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-gradient-to-br from-blue-50/50 to-white p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800/50 dark:from-blue-900/10 dark:to-gray-900/50">
					<div className="absolute right-4 top-4 rounded-full bg-blue-500/10 p-3">
						<Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
					</div>
					<div className="space-y-1">
						<p className="text-sm text-gray-600 dark:text-gray-400">{translations.avgAccuracy}</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgAccuracy}%</p>
						{stats.improvementRate !== 0 && (
							<p className={`flex items-center gap-1 text-xs ${
								stats.improvementRate > 0 ? 'text-green-600' : 'text-red-600'
							}`}>
								<TrendingUp className="h-3 w-3" />
								{stats.improvementRate > 0 ? '+' : ''}{stats.improvementRate}%
							</p>
						)}
					</div>
				</div>

				{/* Current Streak */}
				<div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-gradient-to-br from-orange-50/50 to-white p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800/50 dark:from-orange-900/10 dark:to-gray-900/50">
					<div className="absolute right-4 top-4 rounded-full bg-orange-500/10 p-3">
						<Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
					</div>
					<div className="space-y-1">
						<p className="text-sm text-gray-600 dark:text-gray-400">{translations.currentStreak}</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.currentStreak}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">{translations.days}</p>
					</div>
				</div>

				{/* Best Session */}
				<div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-gradient-to-br from-purple-50/50 to-white p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800/50 dark:from-purple-900/10 dark:to-gray-900/50">
					<div className="absolute right-4 top-4 rounded-full bg-purple-500/10 p-3">
						<Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
					</div>
					<div className="space-y-1">
						<p className="text-sm text-gray-600 dark:text-gray-400">{translations.bestSession}</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.bestAccuracy}%</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">Personal record</p>
					</div>
				</div>

				{/* Favorite Test */}
				<div className="group relative overflow-hidden rounded-xl border border-gray-200/50 bg-gradient-to-br from-pink-50/50 to-white p-6 backdrop-blur-sm transition-all hover:shadow-lg dark:border-gray-800/50 dark:from-pink-900/10 dark:to-gray-900/50">
					<div className="absolute right-4 top-4 rounded-full bg-pink-500/10 p-3">
						<Star className="h-6 w-6 text-pink-600 dark:text-pink-400" />
					</div>
					<div className="space-y-1">
						<p className="text-sm text-gray-600 dark:text-gray-400">{translations.favoriteTest}</p>
						<p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.favoriteTest || '-'}</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">Most practiced</p>
					</div>
				</div>
			</div>

			{/* Recent Activity & Quick Stats */}
			<div className="grid gap-6 lg:grid-cols-2">
				{/* Recent Activity */}
				<div className="rounded-xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
					<div className="mb-4 flex items-center gap-2">
						<Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
						<h3 className="text-lg font-semibold">{translations.recentActivity}</h3>
					</div>
					<div className="space-y-3">
						{stats.recentSessions.map((session) => {
							const avgAccuracy = session.test_results.length > 0
								? Math.round(
									session.test_results.reduce((acc, r) => acc + r.accuracy, 0) /
									session.test_results.length
								)
								: 0;

							return (
								<div
									key={session.id}
									className="flex items-center justify-between rounded-lg border border-gray-200/50 bg-gradient-to-r from-gray-50/50 to-white/50 p-3 dark:border-gray-800/50 dark:from-gray-900/50 dark:to-gray-800/50"
								>
									<div className="flex items-center gap-3">
										<div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
											<Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
										</div>
										<div>
											<p className="text-sm font-medium">
												{format(new Date(session.start_time), 'MMM dd, yyyy')}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{session.total_tests_completed || 0} tests
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="text-lg font-bold text-blue-600 dark:text-blue-400">{avgAccuracy}%</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Quick Stats */}
				<div className="rounded-xl border border-gray-200/50 bg-white/50 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:bg-gray-900/50">
					<div className="mb-4 flex items-center gap-2">
						<Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
						<h3 className="text-lg font-semibold">{translations.quickStats}</h3>
					</div>
					<div className="space-y-4">
						{/* Progress Rings */}
						<div className="space-y-3">
							<div>
								<div className="mb-1 flex items-center justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">Overall Performance</span>
									<span className="font-semibold text-blue-600 dark:text-blue-400">{stats.avgAccuracy}%</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
									<div
										className="h-full rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all"
										style={{ width: `${stats.avgAccuracy}%` }}
									/>
								</div>
							</div>

							<div>
								<div className="mb-1 flex items-center justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-400">Activity Streak</span>
									<span className="font-semibold text-orange-600 dark:text-orange-400">{Math.min((stats.currentStreak / 7) * 100, 100).toFixed(0)}%</span>
								</div>
								<div className="h-3 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
									<div
										className="h-full rounded-full bg-gradient-to-r from-orange-600 to-pink-600 transition-all"
										style={{ width: `${Math.min((stats.currentStreak / 7) * 100, 100)}%` }}
									/>
								</div>
							</div>
						</div>

						{/* Stats Grid */}
						<div className="grid grid-cols-2 gap-3 pt-2">
							<div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 p-3 dark:from-gray-900 dark:to-gray-800/50">
								<p className="text-xs text-gray-600 dark:text-gray-400">Total Tests</p>
								<p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTests}</p>
							</div>
							<div className="rounded-lg bg-gradient-to-br from-gray-50 to-gray-100/50 p-3 dark:from-gray-900 dark:to-gray-800/50">
								<p className="text-xs text-gray-600 dark:text-gray-400">Sessions</p>
								<p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSessions}</p>
							</div>
						</div>

						{stats.lastSessionDate && (
							<div className="rounded-lg border border-blue-200/50 bg-blue-50/50 p-3 dark:border-blue-800/50 dark:bg-blue-900/20">
								<div className="flex items-center gap-2">
									<Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
									<p className="text-xs text-gray-600 dark:text-gray-400">{translations.lastSession}</p>
								</div>
								<p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
									{format(new Date(stats.lastSessionDate), 'MMM dd, yyyy · HH:mm')}
								</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Decorative Element */}
			<div className="relative overflow-hidden rounded-xl border border-gray-200/50 bg-gradient-to-r from-blue-50/30 via-purple-50/30 to-pink-50/30 p-6 backdrop-blur-sm dark:border-gray-800/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10">
				<div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-2xl" />
				<div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-tr from-pink-400/20 to-purple-400/20 blur-2xl" />
				
				<div className="relative flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">Keep up the great work! 🎉</h3>
						<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
							You're making steady progress. {stats.currentStreak > 0 ? `${stats.currentStreak} day streak!` : 'Start a streak today!'}
						</p>
					</div>
					<Brain className="h-12 w-12 text-purple-600/20 dark:text-purple-400/20" />
				</div>
			</div>
		</div>
	);
}
