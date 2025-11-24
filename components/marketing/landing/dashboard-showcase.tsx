import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, Calendar, Award, LineChart, Activity } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function DashboardShowcase() {
	const t = useTranslations('dashboardShowcase');

	const features = [
		{
			icon: BarChart3,
			title: t('features.history.title'),
			description: t('features.history.description'),
			gradient: 'from-blue-500 to-cyan-500',
		},
		{
			icon: TrendingUp,
			title: t('features.evolution.title'),
			description: t('features.evolution.description'),
			gradient: 'from-purple-500 to-pink-500',
		},
		{
			icon: Calendar,
			title: t('features.sessions.title'),
			description: t('features.sessions.description'),
			gradient: 'from-green-500 to-emerald-500',
		},
		{
			icon: Award,
			title: t('features.achievements.title'),
			description: t('features.achievements.description'),
			gradient: 'from-orange-500 to-red-500',
		},
	];

	return (
		<section className="py-24 relative overflow-hidden">
			{/* Animated background gradients */}
			<div className="pointer-events-none absolute inset-0 -z-10">
				<div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/10 to-orange-500/10 blur-3xl animate-pulse delay-700" />
			</div>

			<div className="container mx-auto px-4">
				<div className="text-center mb-16 space-y-4">
					<Badge className="inline-flex gap-2 px-4 py-1.5">
						<LineChart className="w-4 h-4" />
						{t('badge')}
					</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
						<span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
							{t('title')}
						</span>
					</h2>
					<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
						{t('description')}
					</p>
				</div>

				{/* Main Dashboard Preview Card - Desktop */}
				<div className="max-w-6xl mx-auto mb-12 hidden md:block">
					<Card className="relative overflow-hidden border-2 shadow-2xl">
						{/* Gradient border effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur opacity-75" />
						
						<CardContent className="relative p-8 md:p-12">
							{/* Mock Dashboard UI */}
							<div className="space-y-6">
								{/* Header */}
								<div className="flex items-center justify-between pb-6 border-b">
									<div className="flex items-center gap-3">
										<div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
										<Activity className="w-6 h-6 text-white" />
										</div>
										<div>
											<h3 className="font-semibold text-lg">{t('preview.title')}</h3>
											<p className="text-sm text-muted-foreground">{t('preview.subtitle')}</p>
										</div>
									</div>
									<Badge variant="secondary" className="gap-2">
										<Award className="w-4 h-4" />
										{t('preview.badge')}
									</Badge>
								</div>

								{/* Stats Grid */}
								<div className="grid grid-cols-4 gap-4">
									{[
										{ label: t('preview.stats.tests'), value: '24', icon: BarChart3 },
										{ label: t('preview.stats.accuracy'), value: '87%', icon: TrendingUp },
										{ label: t('preview.stats.sessions'), value: '12', icon: Calendar },
										{ label: t('preview.stats.streak'), value: '5d', icon: Award },
									].map((stat, idx) => (
										<div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border">
											<div className="flex items-center gap-2 mb-2">
												<stat.icon className="w-4 h-4 text-muted-foreground" />
												<span className="text-xs text-muted-foreground">{stat.label}</span>
											</div>
											<p className="text-2xl font-bold">{stat.value}</p>
										</div>
									))}
								</div>

								{/* Chart placeholder with gradient */}
								<div className="h-48 rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-dashed flex items-center justify-center">
									<div className="text-center space-y-2">
										<LineChart className="w-12 h-12 mx-auto text-muted-foreground animate-pulse" />
										<p className="text-sm text-muted-foreground font-medium">{t('preview.chart')}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Dashboard Preview Card - Mobile */}
				<div className="max-w-6xl mx-auto mb-12 md:hidden">
					<Card className="relative overflow-hidden border-2 shadow-xl">
						{/* Gradient border effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-lg blur opacity-75" />
						
						<CardContent className="relative p-4">
							{/* Mock Dashboard UI - Mobile Optimized */}
							<div className="space-y-4">
								{/* Header - Compact */}
								<div className="flex items-center gap-3 pb-4 border-b">
									<div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
										<Activity className="w-5 h-5 text-white" />
									</div>
									<div className="flex-1 min-w-0">
										<h3 className="font-semibold text-base truncate">{t('preview.title')}</h3>
										<p className="text-xs text-muted-foreground truncate">{t('preview.subtitle')}</p>
									</div>
								</div>

								{/* Stats Grid - 2 columns for mobile */}
								<div className="grid grid-cols-2 gap-3">
									{[
										{ label: t('preview.stats.tests'), value: '24', icon: BarChart3 },
										{ label: t('preview.stats.accuracy'), value: '87%', icon: TrendingUp },
										{ label: t('preview.stats.sessions'), value: '12', icon: Calendar },
										{ label: t('preview.stats.streak'), value: '5d', icon: Award },
									].map((stat, idx) => (
										<div key={idx} className="p-3 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border">
											<div className="flex items-center gap-1.5 mb-1">
												<stat.icon className="w-3.5 h-3.5 text-muted-foreground" />
												<span className="text-xs text-muted-foreground">{stat.label}</span>
											</div>
											<p className="text-xl font-bold">{stat.value}</p>
										</div>
									))}
								</div>

								{/* Chart placeholder - Compact */}
								<div className="h-32 rounded-lg bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-dashed flex items-center justify-center">
									<div className="text-center space-y-1">
										<LineChart className="w-8 h-8 mx-auto text-muted-foreground animate-pulse" />
										<p className="text-xs text-muted-foreground font-medium">{t('preview.chart')}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Feature Cards Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
					{features.map((feature, idx) => (
						<Card 
							key={idx} 
							className="relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 border-2"
						>
							{/* Animated gradient background on hover */}
							<div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
							
							<CardContent className="p-6 space-y-4 relative">
								<div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg`}>
									<feature.icon className="w-6 h-6 text-white" />
								</div>
								<div className="space-y-2">
									<h3 className="font-semibold text-lg">{feature.title}</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</div>
								
								{/* Bottom gradient line */}
								<div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
