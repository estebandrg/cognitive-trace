interface TestFeedbackProps {
  show: boolean;
  gradient: string;
}

export function TestFeedback({ show, gradient }: TestFeedbackProps) {
  if (!show) return null;

  // Map gradient to color
  const colorClasses = {
    'blue-indigo': 'bg-blue-500/10',
    'green-purple': 'bg-green-500/10',
    'purple-blue': 'bg-purple-500/10',
    'orange-purple': 'bg-orange-500/10',
  };

  const colorClass = colorClasses[gradient as keyof typeof colorClasses] || colorClasses['blue-indigo'];

  return (
    <div className={`absolute inset-0 ${colorClass} rounded-lg animate-ping pointer-events-none`} />
  );
}
