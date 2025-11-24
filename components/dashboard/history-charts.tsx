'use client';

import { memo } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, RadialBarChart, RadialBar } from 'recharts';
import { Target, Zap, Activity, Brain } from 'lucide-react';

const GRADIENT_COLORS = [
	{ id: 'blue', start: '#3b82f6', end: '#60a5fa', stroke: '#3b82f6' },
	{ id: 'purple', start: '#8b5cf6', end: '#a78bfa', stroke: '#8b5cf6' },
	{ id: 'pink', start: '#ec4899', end: '#f472b6', stroke: '#ec4899' },
	{ id: 'green', start: '#10b981', end: '#34d399', stroke: '#10b981' }
];

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-xl border border-gray-200/50 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-xl dark:border-gray-800/50 dark:bg-gray-900/95">
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

interface AccuracyChartProps {
	data: Array<{ name: string; date: string; accuracy: number }>;
	title: string;
}

export const AccuracyChart = memo(function AccuracyChart({ data, title }: AccuracyChartProps) {
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
						<linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
							<stop offset="100%" stopColor="#3b82f6" stopOpacity={0.05}/>
						</linearGradient>
					</defs>
					<CartesianGrid 
						strokeDasharray="3 3" 
						className="stroke-gray-200/30 dark:stroke-gray-800/30"
						vertical={false}
					/>
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
						fill="url(#accuracyGradient)"
						isAnimationActive={false}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
});

interface ReactionTimeChartProps {
	data: Array<{ name: string; date: string; rt: number }>;
	title: string;
}

export const ReactionTimeChart = memo(function ReactionTimeChart({ data, title }: ReactionTimeChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 p-2">
					<Zap className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<LineChart data={data}>
					<CartesianGrid 
						strokeDasharray="3 3" 
						className="stroke-gray-200/30 dark:stroke-gray-800/30"
						vertical={false}
					/>
					<XAxis
						dataKey="date"
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
						tickFormatter={(value) => `${value}ms`}
					/>
					<Tooltip content={<CustomTooltip />} />
					<Line
						type="monotone"
						dataKey="rt"
						stroke="#8b5cf6"
						strokeWidth={2}
						dot={{ r: 4, fill: '#8b5cf6' }}
						isAnimationActive={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
});

interface TestDistributionChartProps {
	data: Array<{ name: string; value: number }>;
	title: string;
}

export const TestDistributionChart = memo(function TestDistributionChart({ data, title }: TestDistributionChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-pink-500 to-orange-600 p-2">
					<Activity className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<PieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						outerRadius={100}
						dataKey="value"
						label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
						isAnimationActive={false}
					>
						{data.map((entry, index) => (
							<Cell 
								key={`cell-${index}`} 
								fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length].stroke}
							/>
						))}
					</Pie>
					<Tooltip content={<CustomTooltip />} />
				</PieChart>
			</ResponsiveContainer>
		</div>
	);
});

interface PerformanceByTestChartProps {
	data: Array<{ test: string; accuracy: number; rt: number; color: string }>;
	title: string;
}

export const PerformanceByTestChart = memo(function PerformanceByTestChart({ data, title }: PerformanceByTestChartProps) {
	return (
		<div className="rounded-2xl border border-gray-200/50 bg-white p-6 dark:border-gray-800/50 dark:bg-gray-900">
			<h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
				<div className="rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 p-2">
					<Brain className="h-4 w-4 text-white" />
				</div>
				<span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{title}</span>
			</h3>
			<ResponsiveContainer width="100%" height={300}>
				<BarChart data={data}>
					<CartesianGrid 
						strokeDasharray="3 3" 
						className="stroke-gray-200/30 dark:stroke-gray-800/30"
						vertical={false}
					/>
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
					<Bar 
						dataKey="accuracy" 
						fill="#10b981"
						name="Accuracy %"
						radius={[8, 8, 0, 0]}
						isAnimationActive={false}
					>
						{data.map((entry, index) => (
							<Cell 
								key={`cell-${index}`}
								fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length].stroke}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
});
