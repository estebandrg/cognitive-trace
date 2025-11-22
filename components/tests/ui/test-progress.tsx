import { Progress } from '@/components/ui/progress';

interface TestProgressProps {
  currentTrial: number;
  totalTrials: number;
}

export function TestProgress({ currentTrial, totalTrials }: TestProgressProps) {
  const percentage = (currentTrial / totalTrials) * 100;

  return (
    <div className="flex justify-between items-center max-w-md mx-auto">
      <span className="text-sm text-slate-600 dark:text-slate-400">
        Trial {currentTrial} / {totalTrials}
      </span>
      <Progress value={percentage} className="w-32" />
    </div>
  );
}
