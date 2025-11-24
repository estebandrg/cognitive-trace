'use client';

import { memo } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Target, TrendingUp, Brain, Award } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-xl border border-gray-200/50 bg-white/95 px-4 py-3 shadow-xl dark:border-gray-800/50 dark:bg-gray-900/95">
				<p className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">{label}</p>
				{payload.map((entry: any, index: number) => (
					<p key={index} className="text-sm" style={{ color: entry.color }}>
						{entry.name}: <span className="font-bold">{entry.value}</span>
					</p>
				))}
			</div>
		);
	}
	return null;
};

interface AccuracyTrendChartProps {
	data: Array<{ session: string; date: string; accuracy: number; rt: number | null }>;
	title: string;
}

export const AccuracyTrendChart = memo(function AccuracyTrendChart({ data, title }: AccuracyTrendChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
					<Target className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<AreaChart data={data}>
					<defs>
						<linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
							<stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
						</linearGradient>
					</defs>
					<CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/30 dark:stroke-gray-800/30" vertical={false} />
					<XAxis 
						dataKey="date" 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={{ stroke: 'currentColor', strokeWidth: 0.5, strokeOpacity: 0.2 }}
						tickLine={false}
					/>
					<YAxis 
						domain={[0, 100]} 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={false}
						tickLine={false}
						tickFormatter={(value) => `${value}%`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Area
						type="monotone"
						dataKey="accuracy"
						stroke="#3b82f6"
						strokeWidth={2}
						fill="url(#colorAcc)"
						isAnimationActive={false}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
});

interface RadarChartProps {
	data: Array<{ test: string; score: number; fullMark: number }>;
	title: string;
}

export const PerformanceRadarChart = memo(function PerformanceRadarChart({ data, title }: RadarChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2">
					<Brain className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<RadarChart data={data}>
					<PolarGrid className="stroke-gray-200/30 dark:stroke-gray-800/30" />
					<PolarAngleAxis 
						dataKey="test" 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
					/>
					<PolarRadiusAxis 
						domain={[0, 100]} 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
					/>
					<Radar
						name="Score"
						dataKey="score"
						stroke="#8b5cf6"
						fill="#8b5cf6"
						fillOpacity={0.4}
						isAnimationActive={false}
					/>
					<Tooltip content={<CustomTooltip />} />
				</RadarChart>
			</ResponsiveContainer>
		</div>
	);
});

interface WeeklyProgressChartProps {
	data: Array<{ week: string; sessions: number; avgAccuracy: number; avgRT: number }>;
	title: string;
}

export const WeeklyProgressChart = memo(function WeeklyProgressChart({ data, title }: WeeklyProgressChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2">
					<TrendingUp className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/30 dark:stroke-gray-800/30" vertical={false} />
					<XAxis 
						dataKey="week" 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={{ stroke: 'currentColor', strokeWidth: 0.5, strokeOpacity: 0.2 }}
						tickLine={false}
					/>
					<YAxis 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Bar dataKey="avgAccuracy" fill="#10b981" name="Avg Accuracy" radius={[8, 8, 0, 0]} isAnimationActive={false} />
					<Bar dataKey="sessions" fill="#3b82f6" name="Sessions" radius={[8, 8, 0, 0]} isAnimationActive={false} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
});

interface TestComparisonChartProps {
	data: Array<{ test: string; early: number; recent: number; change: number }>;
	title: string;
}

export const TestComparisonChart = memo(function TestComparisonChart({ data, title }: TestComparisonChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-pink-500 to-orange-600 p-2">
					<Award className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/30 dark:stroke-gray-800/30" vertical={false} />
					<XAxis 
						dataKey="test" 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={{ stroke: 'currentColor', strokeWidth: 0.5, strokeOpacity: 0.2 }}
						tickLine={false}
					/>
					<YAxis 
						domain={[0, 100]} 
						className="text-xs" 
						tick={{ fill: 'currentColor', fontSize: 12 }}
						axisLine={false}
						tickLine={false}
						tickFormatter={(value) => `${value}%`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Legend />
					<Bar dataKey="early" fill="#9ca3af" name="Early Sessions" radius={[8, 8, 0, 0]} isAnimationActive={false} />
					<Bar dataKey="recent" fill="#8b5cf6" name="Recent Sessions" radius={[8, 8, 0, 0]} isAnimationActive={false} />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
});
