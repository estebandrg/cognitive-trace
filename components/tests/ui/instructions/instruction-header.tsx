import { LucideIcon } from 'lucide-react';

interface InstructionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
}

export function InstructionHeader({
  icon: Icon,
  title,
  subtitle,
  description,
  gradient,
}: InstructionHeaderProps) {
  // Map gradient theme to Tailwind classes
  const gradientClasses = {
    'blue-indigo': {
      iconBg: 'from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900',
      iconColor: 'text-blue-600 dark:text-blue-400',
      textGradient: 'from-blue-600 to-indigo-600',
    },
    'green-purple': {
      iconBg: 'from-green-100 to-purple-100 dark:from-green-900 dark:to-purple-900',
      iconColor: 'text-green-600 dark:text-green-400',
      textGradient: 'from-green-600 to-purple-600',
    },
    'purple-blue': {
      iconBg: 'from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900',
      iconColor: 'text-purple-600 dark:text-purple-400',
      textGradient: 'from-purple-600 to-blue-600',
    },
    'orange-purple': {
      iconBg: 'from-orange-100 to-purple-100 dark:from-orange-900 dark:to-purple-900',
      iconColor: 'text-orange-600 dark:text-orange-400',
      textGradient: 'from-orange-600 to-purple-600',
    },
  };

  const colors = gradientClasses[gradient as keyof typeof gradientClasses];

  return (
    <div className="text-center space-y-4">
      <div className="flex justify-center">
        <div className={`p-6 bg-gradient-to-br ${colors.iconBg} rounded-2xl shadow-lg`}>
          <Icon size={64} className={colors.iconColor} />
        </div>
      </div>
      
      <h2 className={`text-4xl font-bold bg-gradient-to-r ${colors.textGradient} bg-clip-text text-transparent`}>
        {title}
      </h2>
      <p className="text-xl text-muted-foreground">
        {subtitle}
      </p>
      <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
        {description}
      </p>
    </div>
  );
}
