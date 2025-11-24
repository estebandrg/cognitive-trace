'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Globe, Moon, Sun, Monitor, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

interface UserMenuProps {
	locale: string;
	translations: {
		logout: string;
		language: string;
		theme: string;
		lightMode: string;
		darkMode: string;
		systemMode: string;
		english: string;
		spanish: string;
	};
}

export function UserMenu({ locale, translations }: UserMenuProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [userEmail, setUserEmail] = useState<string | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		fetchUserData();
	}, []);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen]);

	const fetchUserData = async () => {
		const supabase = createClient();
		const { data: { user } } = await supabase.auth.getUser();
		if (user) {
			setUserEmail(user.email || null);
		}
	};

	const handleLogout = async () => {
		const supabase = createClient();
		await supabase.auth.signOut();
		router.push(`/${locale}/auth/login`);
	};

	const handleLanguageChange = (newLocale: string) => {
		const currentPath = window.location.pathname;
		const newPath = currentPath.replace(`/${locale}/`, `/${newLocale}/`);
		router.push(newPath);
		setIsOpen(false);
	};

	const handleThemeChange = (newTheme: string) => {
		setTheme(newTheme);
		setIsOpen(false);
	};

	const getInitials = (email: string | null) => {
		if (!email) return 'U';
		return email.charAt(0).toUpperCase();
	};

	const themeOptions = [
		{ value: 'light', label: translations.lightMode, icon: Sun },
		{ value: 'dark', label: translations.darkMode, icon: Moon },
		{ value: 'system', label: translations.systemMode, icon: Monitor }
	];

	const languageOptions = [
		{ value: 'en', label: translations.english, flag: '🇺🇸' },
		{ value: 'es', label: translations.spanish, flag: '🇪🇸' }
	];

	if (!mounted) {
		return (
			<div className="h-10 w-10 rounded-lg bg-gray-200 animate-pulse dark:bg-gray-800" />
		);
	}

	return (
		<div ref={dropdownRef} className="relative">
			{/* User Avatar Button */}
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="group flex items-center gap-2 rounded-lg bg-white/50 p-2 pr-3 backdrop-blur-sm transition-all duration-200 hover:bg-white/80 hover:shadow-md dark:bg-gray-800/50 dark:hover:bg-gray-800/80"
			>
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-sm font-semibold text-white shadow-md transition-transform duration-200 group-hover:scale-105">
					{getInitials(userEmail)}
				</div>
				<ChevronDown className={`h-4 w-4 text-gray-600 transition-transform duration-300 dark:text-gray-400 ${
					isOpen ? 'rotate-180' : ''
				}`} />
			</button>

			{/* Dropdown Menu */}
			{isOpen && (
				<>
					{/* Backdrop for mobile */}
					<div className="fixed inset-0 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
					
					<div className="absolute right-0 top-full z-50 mt-2 w-64 origin-top-right animate-in fade-in slide-in-from-top-2 duration-200">
						<div className="overflow-hidden rounded-xl border border-gray-200/50 bg-white/95 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/95">
							{/* User Info Header */}
							{userEmail && (
								<div className="border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-4 dark:border-gray-800/50 dark:from-blue-900/10 dark:to-purple-900/10">
									<div className="flex items-center gap-3">
										<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-base font-semibold text-white shadow-md">
											{getInitials(userEmail)}
										</div>
										<div className="flex-1 min-w-0">
											<p className="truncate text-sm font-medium text-gray-900 dark:text-white">
												{userEmail}
											</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{translations.language}: {locale.toUpperCase()}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className="p-2">
								{/* Language Section */}
								<div className="mb-2">
									<div className="mb-1 px-2 py-1">
										<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
											<Globe className="h-3 w-3" />
											{translations.language}
										</div>
									</div>
									<div className="space-y-0.5">
										{languageOptions.map((option) => (
											<button
												key={option.value}
												onClick={() => handleLanguageChange(option.value)}
												className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
													locale === option.value
														? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400'
														: 'text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
												}`}
											>
												<span className="text-lg">{option.flag}</span>
												<span className="flex-1">{option.label}</span>
												{locale === option.value && (
													<div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
												)}
											</button>
										))}
									</div>
								</div>

								{/* Theme Section */}
								<div className="mb-2">
									<div className="mb-1 px-2 py-1">
										<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
											{theme === 'dark' ? <Moon className="h-3 w-3" /> : <Sun className="h-3 w-3" />}
											{translations.theme}
										</div>
									</div>
									<div className="space-y-0.5">
										{themeOptions.map((option) => {
											const Icon = option.icon;
											return (
												<button
													key={option.value}
													onClick={() => handleThemeChange(option.value)}
													className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
														theme === option.value
															? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-600 dark:text-purple-400'
															: 'text-gray-700 hover:bg-gray-100/80 dark:text-gray-300 dark:hover:bg-gray-800/80'
													}`}
												>
													<Icon className="h-4 w-4" />
													<span className="flex-1">{option.label}</span>
													{theme === option.value && (
														<div className="h-1.5 w-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
													)}
												</button>
											);
										})}
									</div>
								</div>

								{/* Logout Button */}
								<div className="mt-2 border-t border-gray-200/50 pt-2 dark:border-gray-800/50">
									<button
										onClick={handleLogout}
										className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-red-600 transition-all duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
									>
										<LogOut className="h-4 w-4" />
										<span className="flex-1 font-medium">{translations.logout}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
