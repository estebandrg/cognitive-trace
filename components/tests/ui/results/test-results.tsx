import { Button } from '@/components/ui/button';
import { TestResult } from '@/lib/types/tests';
import { MetricCard } from './metric-card';
import { RotateCcw } from 'lucide-react';
import { ReactNode } from 'react';

interface Metric {
  label: string;
  value: string | number;
  color?: 'green' | 'blue' | 'orange' | 'red' | 'purple';
  suffix?: string;
}

interface TestResultsProps {
  title: string;
  subtitle: string;
  metrics: Metric[];
  summarySection?: ReactNode;
  onRetry: () => void;
  onContinue: (result: TestResult) => void;
  result: TestResult;
}

export function TestResults({
  title,
  subtitle,
  metrics,
  summarySection,
  onRetry,
  onContinue,
  result,
}: TestResultsProps) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-slate-600 dark:text-slate-400">
          {subtitle}
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      
      {/* Summary Section */}
      {summarySection}
      
      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button onClick={() => onContinue(result)} variant="default">
          Continue
        </Button>
        <Button onClick={onRetry} variant="outline">
          <RotateCcw size={16} className="mr-2" />
          Retry Test
        </Button>
      </div>
    </div>
  );
}
