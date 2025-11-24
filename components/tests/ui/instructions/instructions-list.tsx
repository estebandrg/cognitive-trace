import { Card, CardContent } from '@/components/ui/card';

interface InstructionsListProps {
  title: string;
  items: string[];
  type: 'do' | 'dont';
}

export function InstructionsList({ title, items, type }: InstructionsListProps) {
  const colors = type === 'do' ? {
    icon: 'text-green-600',
    iconBg: 'bg-green-100 dark:bg-green-900',
    bullet: 'text-green-600',
    checkmark: '✓',
  } : {
    icon: 'text-red-600',
    iconBg: 'bg-red-100 dark:bg-red-900',
    bullet: 'text-red-600',
    checkmark: '✗',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className={`w-6 h-6 ${colors.iconBg} rounded-full flex items-center justify-center`}>
            <span className={`text-xs font-bold ${colors.icon}`}>{colors.checkmark}</span>
          </div>
          {title}
        </h3>
        <ul className="space-y-3 text-sm">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className={`${colors.bullet} mt-0.5`}>•</span>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
