import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  label: string;
  value: string | number;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  suffix?: string;
}

export function MetricCard({ label, value, color = 'blue', suffix = '' }: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-600 dark:text-green-400',
    blue: 'text-blue-600 dark:text-blue-400',
    orange: 'text-orange-600 dark:text-orange-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  const colorClass = colorClasses[color];

  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className={`text-2xl font-bold ${colorClass}`}>
          {value}{suffix}
        </div>
        <div className="text-sm text-slate-600 dark:text-slate-400">{label}</div>
      </CardContent>
    </Card>
  );
}
