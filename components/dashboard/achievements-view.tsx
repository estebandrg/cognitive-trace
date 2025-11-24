'use client';

import { useMemo } from 'react';
import { Trophy, Target, Zap, Brain, Calendar, TrendingUp, Award, Star, Flame, CheckCircle2, Lock } from 'lucide-react';

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

interface AchievementsViewProps {
	sessions: SessionData[];
	translations: {
		title: string;
		description: string;
		unlocked: string;
		locked: string;
		progress: string;
		categories: {
			beginner: string;
			accuracy: string;
			speed: string;
			consistency: string;
			mastery: string;
		};
	};
}

interface Achievement {
	id: string;
	category: string;
	icon: any;
	name: string;
	description: string;
	requirement: string;
	unlocked: boolean;
	progress: number;
	maxProgress: number;
	rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export function AchievementsView({ sessions, translations }: AchievementsViewProps) {
	const completedSessions = useMemo(() => 
		sessions.filter(s => s.test_results && s.test_results.length > 0), 
		[sessions]
	);

	const achievements = useMemo((): Achievement[] => {
		const allResults = completedSessions.flatMap(s => s.test_results);
		const totalTests = allResults.length;
		
		// Calculate stats
		const avgAccuracy = totalTests > 0 
			? allResults.reduce((acc, r) => acc + r.accuracy, 0) / totalTests 
			: 0;
		
		const perfectSessions = completedSessions.filter(s => {
			const sessionAvg = s.test_results.reduce((acc, r) => acc + r.accuracy, 0) / s.test_results.length;
			return sessionAvg === 100;
		}).length;

		const highAccuracySessions = completedSessions.filter(s => {
			const sessionAvg = s.test_results.reduce((acc, r) => acc + r.accuracy, 0) / s.test_results.length;
			return sessionAvg >= 95;
		}).length;

		// Check consecutive days
		const getDayString = (date: Date) => date.toISOString().split('T')[0];
		const uniqueDays = new Set(completedSessions.map(s => getDayString(new Date(s.start_time))));
		const sortedDays = Array.from(uniqueDays).sort();
		
		let currentStreak = 0;
		let maxStreak = 0;
		let tempStreak = 1;
		
		for (let i = 1; i < sortedDays.length; i++) {
			const prevDate = new Date(sortedDays[i - 1]);
			const currDate = new Date(sortedDays[i]);
			const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
			
			if (diffDays === 1) {
				tempStreak++;
			} else {
				maxStreak = Math.max(maxStreak, tempStreak);
				tempStreak = 1;
			}
		}
		maxStreak = Math.max(maxStreak, tempStreak);
		
		// Check if current streak is still active
		const today = getDayString(new Date());
		const yesterday = getDayString(new Date(Date.now() - 86400000));
		const lastSessionDay = sortedDays[sortedDays.length - 1];
		
		if (lastSessionDay === today || lastSessionDay === yesterday) {
			currentStreak = tempStreak;
		}

		// Test-specific achievements
		const testTypes = ['sart', 'flanker', 'nback', 'pvt'];
		const testCounts = testTypes.map(type => 
			allResults.filter(r => r.test_type === type).length
		);

		return [
			// Beginner achievements
			{
				id: 'first-steps',
				category: 'beginner',
				icon: Star,
				name: 'First Steps',
				description: 'Complete your first session',
				requirement: '1 session',
				unlocked: completedSessions.length >= 1,
				progress: Math.min(completedSessions.length, 1),
				maxProgress: 1,
				rarity: 'common'
			},
			{
				id: 'getting-started',
				category: 'beginner',
				icon: Target,
				name: 'Getting Started',
				description: 'Complete 5 sessions',
				requirement: '5 sessions',
				unlocked: completedSessions.length >= 5,
				progress: Math.min(completedSessions.length, 5),
				maxProgress: 5,
				rarity: 'common'
			},
			{
				id: 'committed',
				category: 'beginner',
				icon: Trophy,
				name: 'Committed',
				description: 'Complete 10 sessions',
				requirement: '10 sessions',
				unlocked: completedSessions.length >= 10,
				progress: Math.min(completedSessions.length, 10),
				maxProgress: 10,
				rarity: 'rare'
			},
			{
				id: 'dedicated',
				category: 'beginner',
				icon: Award,
				name: 'Dedicated',
				description: 'Complete 25 sessions',
				requirement: '25 sessions',
				unlocked: completedSessions.length >= 25,
				progress: Math.min(completedSessions.length, 25),
				maxProgress: 25,
				rarity: 'epic'
			},
			{
				id: 'veteran',
				category: 'beginner',
				icon: Trophy,
				name: 'Veteran',
				description: 'Complete 50 sessions',
				requirement: '50 sessions',
				unlocked: completedSessions.length >= 50,
				progress: Math.min(completedSessions.length, 50),
				maxProgress: 50,
				rarity: 'legendary'
			},

			// Accuracy achievements
			{
				id: 'sharpshooter',
				category: 'accuracy',
				icon: Target,
				name: 'Sharpshooter',
				description: 'Achieve 90%+ average accuracy',
				requirement: '90% accuracy',
				unlocked: avgAccuracy >= 90,
				progress: Math.min(Math.floor(avgAccuracy), 90),
				maxProgress: 90,
				rarity: 'rare'
			},
			{
				id: 'perfectionist',
				category: 'accuracy',
				icon: Star,
				name: 'Perfectionist',
				description: 'Complete a session with 100% accuracy',
				requirement: '100% in one session',
				unlocked: perfectSessions >= 1,
				progress: Math.min(perfectSessions, 1),
				maxProgress: 1,
				rarity: 'epic'
			},
			{
				id: 'flawless',
				category: 'accuracy',
				icon: Trophy,
				name: 'Flawless',
				description: 'Complete 5 sessions with 95%+ accuracy',
				requirement: '5 sessions at 95%',
				unlocked: highAccuracySessions >= 5,
				progress: Math.min(highAccuracySessions, 5),
				maxProgress: 5,
				rarity: 'epic'
			},

			// Consistency achievements
			{
				id: 'habit-forming',
				category: 'consistency',
				icon: Calendar,
				name: 'Habit Forming',
				description: 'Complete sessions 3 days in a row',
				requirement: '3 day streak',
				unlocked: maxStreak >= 3,
				progress: Math.min(maxStreak, 3),
				maxProgress: 3,
				rarity: 'rare'
			},
			{
				id: 'on-fire',
				category: 'consistency',
				icon: Flame,
				name: 'On Fire!',
				description: 'Complete sessions 7 days in a row',
				requirement: '7 day streak',
				unlocked: maxStreak >= 7,
				progress: Math.min(maxStreak, 7),
				maxProgress: 7,
				rarity: 'epic'
			},
			{
				id: 'unstoppable',
				category: 'consistency',
				icon: Flame,
				name: 'Unstoppable',
				description: 'Complete sessions 14 days in a row',
				requirement: '14 day streak',
				unlocked: maxStreak >= 14,
				progress: Math.min(maxStreak, 14),
				maxProgress: 14,
				rarity: 'legendary'
			},

			// Mastery achievements
			{
				id: 'sart-specialist',
				category: 'mastery',
				icon: Brain,
				name: 'SART Specialist',
				description: 'Complete 20 SART tests',
				requirement: '20 SART tests',
				unlocked: testCounts[0] >= 20,
				progress: Math.min(testCounts[0], 20),
				maxProgress: 20,
				rarity: 'rare'
			},
			{
				id: 'flanker-master',
				category: 'mastery',
				icon: Zap,
				name: 'Flanker Master',
				description: 'Complete 20 Flanker tests',
				requirement: '20 Flanker tests',
				unlocked: testCounts[1] >= 20,
				progress: Math.min(testCounts[1], 20),
				maxProgress: 20,
				rarity: 'rare'
			},
			{
				id: 'memory-champion',
				category: 'mastery',
				icon: Brain,
				name: 'Memory Champion',
				description: 'Complete 20 N-Back tests',
				requirement: '20 N-Back tests',
				unlocked: testCounts[2] >= 20,
				progress: Math.min(testCounts[2], 20),
				maxProgress: 20,
				rarity: 'rare'
			},
			{
				id: 'speed-demon',
				category: 'mastery',
				icon: Zap,
				name: 'Speed Demon',
				description: 'Complete 20 PVT tests',
				requirement: '20 PVT tests',
				unlocked: testCounts[3] >= 20,
				progress: Math.min(testCounts[3], 20),
				maxProgress: 20,
				rarity: 'rare'
			},
			{
				id: 'jack-of-all-trades',
				category: 'mastery',
				icon: Award,
				name: 'Jack of All Trades',
				description: 'Complete 10+ tests of each type',
				requirement: '10 of each test',
				unlocked: testCounts.every(count => count >= 10),
				progress: Math.min(...testCounts, 10),
				maxProgress: 10,
				rarity: 'epic'
			},
		];
	}, [completedSessions, translations]);

	const rarityColors = {
		common: 'from-gray-500 to-gray-600',
		rare: 'from-blue-500 to-blue-600',
		epic: 'from-purple-500 to-pink-600',
		legendary: 'from-yellow-500 to-orange-600'
	};

	const rarityBorders = {
		common: 'border-gray-300 dark:border-gray-700',
		rare: 'border-blue-400 dark:border-blue-600',
		epic: 'border-purple-400 dark:border-purple-600',
		legendary: 'border-yellow-400 dark:border-yellow-600'
	};

	const unlockedCount = achievements.filter(a => a.unlocked).length;
	const totalCount = achievements.length;

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
						{translations.title}
					</h1>
					<p className="mt-2 text-gray-600 dark:text-gray-400">
						{translations.description}
					</p>
				</div>
				<div className="rounded-xl border border-yellow-400/50 bg-gradient-to-br from-yellow-50 to-orange-50 p-4 dark:border-yellow-600/50 dark:from-yellow-900/20 dark:to-orange-900/20">
					<div className="flex items-center gap-3">
						<Trophy className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
						<div>
							<p className="text-sm text-gray-600 dark:text-gray-400">{translations.progress}</p>
							<p className="text-2xl font-bold">
								{unlockedCount}/{totalCount}
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Achievements Grid */}
			<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{achievements.map((achievement) => {
					const Icon = achievement.icon;
					const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

					return (
						<div
							key={achievement.id}
							className={`group relative overflow-hidden rounded-2xl border-2 p-6 transition-all ${
								achievement.unlocked
									? `${rarityBorders[achievement.rarity]} bg-white dark:bg-gray-900 hover:shadow-lg`
									: 'border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50 opacity-60'
							}`}
						>
							{/* Rarity indicator */}
							{achievement.unlocked && (
								<div className={`absolute right-0 top-0 h-16 w-16 bg-gradient-to-bl ${rarityColors[achievement.rarity]} opacity-20`} />
							)}

							<div className="relative">
								<div className="flex items-start justify-between">
									<div className={`rounded-xl p-3 ${
										achievement.unlocked
											? `bg-gradient-to-br ${rarityColors[achievement.rarity]}`
											: 'bg-gray-200 dark:bg-gray-800'
									}`}>
										{achievement.unlocked ? (
											<Icon className="h-6 w-6 text-white" />
										) : (
											<Lock className="h-6 w-6 text-gray-400" />
										)}
									</div>
									{achievement.unlocked && (
										<CheckCircle2 className="h-6 w-6 text-green-500" />
									)}
								</div>

								<h3 className="mt-4 text-lg font-bold">{achievement.name}</h3>
								<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
									{achievement.description}
								</p>
								<p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-500">
									{achievement.requirement}
								</p>

								{/* Progress bar */}
								{!achievement.unlocked && achievement.maxProgress > 1 && (
									<div className="mt-3">
										<div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
											<span>Progress</span>
											<span>{achievement.progress}/{achievement.maxProgress}</span>
										</div>
										<div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
											<div
												className={`h-full bg-gradient-to-r ${rarityColors[achievement.rarity]} transition-all`}
												style={{ width: `${progressPercent}%` }}
											/>
										</div>
									</div>
								)}

								{/* Rarity badge */}
								<div className="mt-3">
									<span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
										achievement.rarity === 'common' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
										achievement.rarity === 'rare' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
										achievement.rarity === 'epic' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' :
										'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
									}`}>
										{achievement.rarity.charAt(0).toUpperCase() + achievement.rarity.slice(1)}
									</span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
