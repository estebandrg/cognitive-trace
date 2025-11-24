'use client';

import { useState } from 'react';
import { History, TrendingUp, Menu, X, PlayCircle, Sparkles, BarChart3, Home, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { UserMenu } from './user-menu';

interface DashboardLayoutProps {
	children: React.ReactNode;
	activeSection: 'home' | 'history' | 'trends' | 'achievements';
	onSectionChange: (section: 'home' | 'history' | 'trends' | 'achievements') => void;
	translations: {
		home: string;
		history: string;
		trends: string;
		achievements: string;
		startSession: string;
		descriptions: {
			home: string;
			history: string;
			trends: string;
			achievements: string;
		};
		sidebar: {
			yourProgress: string;
			analytics: string;
		};
		user: {
			logout: string;
			language: string;
			theme: string;
			lightMode: string;
			darkMode: string;
			systemMode: string;
			english: string;
			spanish: string;
		};
	};
	locale: string;
}

export function DashboardLayout({
	children,
	activeSection,
	onSectionChange,
	translations,
	locale
}: DashboardLayoutProps) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const router = useRouter();

	const navigation = [
		{
			id: 'home' as const,
			name: translations.home,
			icon: Home,
			gradient: 'from-blue-500 via-purple-600 to-pink-600',
			bgGradient: 'from-blue-500/10 via-purple-600/10 to-pink-600/10',
			iconColor: 'text-blue-600 dark:text-blue-400',
			description: translations.descriptions.home
		},
		{
			id: 'history' as const,
			name: translations.history,
			icon: History,
			gradient: 'from-blue-500 via-blue-600 to-cyan-600',
			bgGradient: 'from-blue-500/10 via-blue-600/10 to-cyan-600/10',
			iconColor: 'text-blue-600 dark:text-blue-400',
			description: translations.descriptions.history
		},
		{
			id: 'trends' as const,
			name: translations.trends,
			icon: TrendingUp,
			gradient: 'from-purple-500 via-purple-600 to-pink-600',
			bgGradient: 'from-purple-500/10 via-purple-600/10 to-pink-600/10',
			iconColor: 'text-purple-600 dark:text-purple-400',
			description: translations.descriptions.trends
		},
		{
			id: 'achievements' as const,
			name: translations.achievements,
			icon: Trophy,
			gradient: 'from-yellow-500 via-orange-600 to-red-600',
			bgGradient: 'from-yellow-500/10 via-orange-600/10 to-red-600/10',
			iconColor: 'text-yellow-600 dark:text-yellow-400',
			description: translations.descriptions.achievements
		}
	];

	const handleStartSession = () => {
		router.push(`/${locale}/tests`);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
			{/* Simplified background decorations for better performance */}
			<div className="pointer-events-none fixed inset-0 -z-10 opacity-60">
				<div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
				<div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-pink-400/30 to-purple-400/30 blur-3xl" />
			</div>

			{/* Mobile sidebar backdrop */}
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			{/* Modern Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-gray-200/50 bg-white/90 backdrop-blur-lg transition-all duration-300 ease-in-out dark:border-gray-800/50 dark:bg-gray-950/90 lg:translate-x-0 ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				}`}
			>
				<div className="flex h-full flex-col">
					{/* Logo/Header with gradient - Clickeable */}
					<div className="relative flex h-20 items-center justify-between border-b border-gray-200/50 px-6 dark:border-gray-800/50">
						<button
							onClick={() => router.push(`/${locale}`)}
							className="group flex items-center gap-3 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
						>
							<div className="relative">
								<div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-0 blur transition-opacity duration-300 group-hover:opacity-70" />
								<div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 shadow-lg transition-transform duration-300 group-hover:rotate-12">
									<BarChart3 className="h-5 w-5 text-white" />
								</div>
							</div>
							<div className="text-left">
								<h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-lg font-bold leading-tight text-transparent transition-all duration-300 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-pink-500">
									CognitiveTrace
								</h2>
								<p className="text-xs font-medium text-gray-500 transition-colors duration-300 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300">
									{translations.sidebar.yourProgress}
								</p>
							</div>
						</button>
						<button
							onClick={() => setSidebarOpen(false)}
							className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
						>
							<X className="h-5 w-5" />
						</button>
					</div>

					{/* Start Session Button - TOP OF SIDEBAR */}
					<div className="border-b border-gray-200/50 p-4 dark:border-gray-800/50">
						<button
							onClick={handleStartSession}
							className="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-3 py-2.5 text-left shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity group-hover:opacity-100" />
							<div className="relative flex items-center gap-2.5">
								<div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/20 backdrop-blur-sm">
									<PlayCircle className="h-4 w-4 text-white" />
								</div>
								<div className="flex-1">
									<span className="block text-xs font-semibold text-white">
										{translations.startSession}
									</span>
								</div>
								<Sparkles className="h-4 w-4 text-white/80 transition-transform group-hover:scale-110" />
							</div>
						</button>
					</div>

					{/* Navigation */}
					<nav className="flex-1 space-y-1.5 p-4">
						<p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
							{translations.sidebar.analytics}
						</p>
						{navigation.map((item) => {
							const Icon = item.icon;
							const isActive = activeSection === item.id;

							return (
								<button
									key={item.id}
									onClick={() => {
										onSectionChange(item.id);
										setSidebarOpen(false);
									}}
									className={`group relative w-full overflow-hidden rounded-lg px-3 py-2.5 text-left transition-all duration-300 ${
										isActive
											? 'bg-white/40 dark:bg-gray-800/40 shadow-sm ring-1 ring-black/5 dark:ring-white/5'
											: 'hover:bg-gray-100/50 dark:hover:bg-gray-800/30'
									}`}
								>
									<div className="relative flex items-center gap-2.5">
										{/* Icon with gradient background when active */}
										<div className={`rounded-lg p-1.5 transition-all duration-300 ${
											isActive 
												? 'bg-gradient-to-br ' + item.gradient + ' shadow-lg scale-105' 
												: 'bg-gray-100/80 group-hover:bg-gray-200/80 dark:bg-gray-800/80 dark:group-hover:bg-gray-700/80'
										}`}>
											<Icon className={`h-4 w-4 transition-all duration-300 ${
												isActive ? 'text-white' : item.iconColor
											}`} />
										</div>

										{/* Text content */}
										<div className="flex-1 min-w-0">
											<span className={`block text-sm font-semibold transition-all duration-300 ${
												isActive 
													? 'bg-gradient-to-r ' + item.gradient + ' bg-clip-text text-transparent' 
													: 'text-gray-700 dark:text-gray-300'
											}`}>
												{item.name}
											</span>
											<span className={`mt-0.5 block text-xs transition-all duration-300 truncate ${
												isActive 
													? 'text-gray-700 dark:text-gray-300 font-medium' 
													: 'text-gray-500 dark:text-gray-400'
											}`}>
												{item.description}
											</span>
										</div>

										{/* Animated dot indicator */}
										<div className={`transition-all duration-500 ${
											isActive ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-2 scale-50'
										}`}>
											<div className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.gradient} animate-pulse`} />
										</div>
									</div>

									{/* Animated left border indicator */}
									{isActive && (
										<div className={`absolute left-0 top-1/2 h-12 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b ${item.gradient} shadow-lg transition-all duration-300`} />
									)}
								</button>
							);
						})}
					</nav>
				</div>
			</aside>

			{/* Main content */}
			<div className="lg:pl-72">
				{/* Minimal top bar for mobile */}
				<header className="sticky top-0 z-30 border-b border-gray-200/50 bg-white/90 backdrop-blur-md dark:border-gray-800/50 dark:bg-gray-950/90 lg:hidden">
					<div className="flex h-16 items-center justify-between px-4">
						<div className="flex items-center">
							<button
								onClick={() => setSidebarOpen(true)}
								className="rounded-lg p-2 text-gray-700 transition-colors hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
							>
								<Menu className="h-6 w-6" />
							</button>
							<span className="ml-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-lg font-bold text-transparent">
								CognitiveTrace
							</span>
						</div>
						<UserMenu locale={locale} translations={translations.user} />
					</div>
				</header>

				{/* Fixed User Menu - Top Right (Desktop only) */}
				<div className="fixed right-8 top-8 z-40 hidden lg:block">
					<UserMenu locale={locale} translations={translations.user} />
				</div>

				{/* Page content */}
				<main className="min-h-screen p-4 sm:p-6 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}
