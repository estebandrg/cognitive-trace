'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard/dashboard-layout';
import { OverviewView } from '@/components/dashboard/overview-view';
import { HistoryView } from '@/components/dashboard/history-view';
import { TrendsView } from '@/components/dashboard/trends-view';
import { AchievementsView } from '@/components/dashboard/achievements-view';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

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
		specific_metrics: any;
	}>;
}

export default function NewDashboardPage() {
	const t = useTranslations('dashboard');
	const tNav = useTranslations('dashboard.navigation');
	const tUser = useTranslations('dashboard.user');
	const tOverview = useTranslations('dashboard.overview');
	const tHistory = useTranslations('dashboard.history');
	const tTrends = useTranslations('dashboard.trends');
	const tAchievements = useTranslations('dashboard.achievements');
	const router = useRouter();

	const [activeSection, setActiveSection] = useState<'home' | 'history' | 'trends' | 'achievements'>('home');
	const [sessions, setSessions] = useState<SessionData[]>([]);
	const [loading, setLoading] = useState(true);
	const [locale, setLocale] = useState('en');

	useEffect(() => {
		// Get locale from path
		const pathLocale = window.location.pathname.split('/')[1];
		if (pathLocale === 'en' || pathLocale === 'es') {
			setLocale(pathLocale);
		}

		fetchSessions();
	}, []);

	const fetchSessions = async () => {
		try {
			const supabase = createClient();
			
			// Auth is already checked by middleware for dashboard routes
			// No need for redundant client-side check
			const { data, error } = await supabase
				.from('sessions')
				.select(`
					*,
					test_results (
						id,
						test_type,
						accuracy,
						avg_reaction_time,
						duration,
						specific_metrics
					)
				`)
				.order('start_time', { ascending: false });

			if (error) {
				console.error('Error fetching sessions:', error);
				// If auth fails, Supabase RLS will handle it
				// Middleware will redirect if needed
			} else {
				setSessions(data || []);
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			setLoading(false);
		}
	};

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
			</div>
		);
	}

	return (
		<DashboardLayout
			activeSection={activeSection}
			onSectionChange={setActiveSection}
			translations={{
				home: tNav('home'),
				history: tNav('history'),
				trends: tNav('trends'),
				achievements: tNav('achievements'),
				startSession: tNav('startSession'),
				user: {
					logout: tUser('logout'),
					language: tUser('language'),
					theme: tUser('theme'),
					lightMode: tUser('lightMode'),
					darkMode: tUser('darkMode'),
					systemMode: tUser('systemMode'),
					english: tUser('english'),
					spanish: tUser('spanish')
				}
			}}
			locale={locale}
		>
			{activeSection === 'home' ? (
				<OverviewView
					sessions={sessions}
					translations={{
						title: tOverview('title'),
						welcome: tOverview('welcome'),
						totalSessions: tOverview('totalSessions'),
						avgAccuracy: tOverview('avgAccuracy'),
						bestSession: tOverview('bestSession'),
						currentStreak: tOverview('currentStreak'),
						days: tOverview('days'),
						testsCompleted: tOverview('testsCompleted'),
						lastSession: tOverview('lastSession'),
						recentActivity: tOverview('recentActivity'),
						topPerformance: tOverview('topPerformance'),
						quickStats: tOverview('quickStats'),
						improvementRate: tOverview('improvementRate'),
						favoriteTest: tOverview('favoriteTest'),
						noData: tOverview('noData')
					}}
				/>
			) : activeSection === 'history' ? (
				<HistoryView
					sessions={sessions}
					translations={{
						title: tHistory('title'),
						noSessions: tHistory('noSessions'),
						sessionDate: tHistory('sessionDate'),
						testsCompleted: tHistory('testsCompleted'),
						avgAccuracy: tHistory('avgAccuracy'),
						avgReactionTime: tHistory('avgReactionTime'),
						accuracyOverTime: tHistory('accuracyOverTime'),
						reactionTimeOverTime: tHistory('reactionTimeOverTime'),
						testDistribution: tHistory('testDistribution'),
						performanceByTest: tHistory('performanceByTest'),
						sequential: tHistory('sequential'),
						individual: tHistory('individual'),
						recentSessions: tHistory('recentSessions'),
						viewDetails: tHistory('viewDetails'),
						sessionDetails: tHistory('sessionDetails'),
						sessionInfo: tHistory('sessionInfo'),
						date: tHistory('date'),
						duration: tHistory('duration'),
						type: tHistory('type'),
						overallPerformance: tHistory('overallPerformance'),
						accuracy: tHistory('accuracy'),
						reactionTime: tHistory('reactionTime'),
						testBreakdown: tHistory('testBreakdown'),
						comparison: tHistory('comparison'),
						aboveAverage: tHistory('aboveAverage'),
						belowAverage: tHistory('belowAverage'),
						onAverage: tHistory('onAverage'),
						specificMetrics: tHistory('specificMetrics'),
						close: tHistory('close')
					}}
				/>
			) : activeSection === 'achievements' ? (
				<AchievementsView
					sessions={sessions}
					translations={{
						title: tAchievements('title'),
						description: tAchievements('description'),
						unlocked: tAchievements('unlocked'),
						locked: tAchievements('locked'),
						progress: tAchievements('progress'),
						categories: {
							beginner: tAchievements('categories.beginner'),
							accuracy: tAchievements('categories.accuracy'),
							speed: tAchievements('categories.speed'),
							consistency: tAchievements('categories.consistency'),
							mastery: tAchievements('categories.mastery')
						}
					}}
				/>
			) : (
				<TrendsView
					sessions={sessions}
					translations={{
						title: tTrends('title'),
						noData: tTrends('noData'),
						overallTrend: tTrends('overallTrend'),
						improving: tTrends('improving'),
						declining: tTrends('declining'),
						stable: tTrends('stable'),
						accuracyTrend: tTrends('accuracyTrend'),
						reactionTimeTrend: tTrends('reactionTimeTrend'),
						performanceRadar: tTrends('performanceRadar'),
						weeklyProgress: tTrends('weeklyProgress'),
						testComparison: tTrends('testComparison'),
						insights: tTrends('insights')
					}}
				/>
			)}
		</DashboardLayout>
	);
}
