import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface ResultsSummaryProps {
  title: string;
  children: ReactNode;
}

export function ResultsSummary({ title, children }: ResultsSummaryProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{title}</h3>
        <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
