interface TestCountdownProps {
  countdown: number;
  gradient: string;
  message?: string;
}

export function TestCountdown({ countdown, gradient, message }: TestCountdownProps) {
  // Map gradient to color
  const colorClasses = {
    'blue-indigo': 'text-blue-600 dark:text-blue-400',
    'green-purple': 'text-green-600 dark:text-green-400',
    'purple-blue': 'text-purple-600 dark:text-purple-400',
    'orange-purple': 'text-orange-600 dark:text-orange-400',
  };

  const colorClass = colorClasses[gradient as keyof typeof colorClasses] || colorClasses['blue-indigo'];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-8">Get Ready</h2>
      <div className={`text-8xl font-bold ${colorClass}`}>
        {countdown}
      </div>
      {message && (
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}
