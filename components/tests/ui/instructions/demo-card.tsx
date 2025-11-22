import { ReactNode } from 'react';

interface DemoCardProps {
  title: string;
  description: string;
  visual: ReactNode;
  color: string;
  action: 'respond' | 'withhold' | 'info';
}

export function DemoCard({ title, description, visual, color, action }: DemoCardProps) {
  // Map color to Tailwind classes
  const colorClasses = {
    green: {
      bg: 'from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900',
      border: 'border-green-300 dark:border-green-600',
      text: 'text-green-600',
      badgeBg: 'bg-green-100 dark:bg-green-900',
      badge: action === 'respond' ? '✓' : '',
    },
    red: {
      bg: 'from-red-100 to-pink-100 dark:from-red-900 dark:to-pink-900',
      border: 'border-red-300 dark:border-red-600',
      text: 'text-red-600',
      badgeBg: 'bg-red-100 dark:bg-red-900',
      badge: action === 'withhold' ? '✗' : '',
    },
    blue: {
      bg: 'from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900',
      border: 'border-blue-300 dark:border-blue-600',
      text: 'text-blue-600',
      badgeBg: 'bg-blue-100 dark:bg-blue-900',
      badge: '',
    },
    purple: {
      bg: 'from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900',
      border: 'border-purple-300 dark:border-purple-600',
      text: 'text-purple-600',
      badgeBg: 'bg-purple-100 dark:bg-purple-900',
      badge: '',
    },
    orange: {
      bg: 'from-orange-100 to-amber-100 dark:from-orange-900 dark:to-amber-900',
      border: 'border-orange-300 dark:border-orange-600',
      text: 'text-orange-600',
      badgeBg: 'bg-orange-100 dark:bg-orange-900',
      badge: '',
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

  return (
    <div className="text-center space-y-4">
      <div className={`h-32 bg-gradient-to-br ${colors.bg} rounded-xl border-2 ${colors.border} flex items-center justify-center`}>
        {visual}
      </div>
      <div>
        <h4 className={`font-semibold ${colors.text}`}>{title}</h4>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
        {colors.badge && (
          <div className="flex justify-center mt-2">
            <div className={`w-8 h-8 ${colors.badgeBg} rounded border flex items-center justify-center text-xs font-bold ${colors.text}`}>
              {colors.badge}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
