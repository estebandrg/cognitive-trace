import { SARTTrial } from './sart-types';

interface SARTStimulusProps {
  trial: SARTTrial | null;
  showFeedback?: boolean;
}

export function SARTStimulus({ trial, showFeedback }: SARTStimulusProps) {
  return (
    <div className="h-64 flex items-center justify-center relative">
      {trial !== null ? (
        <div className={`text-9xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-150 ${
          showFeedback ? 'scale-110 text-blue-600 dark:text-blue-400' : 'animate-pulse'
        }`}>
          {trial.number}
        </div>
      ) : (
        <div className="text-4xl text-slate-400">+</div>
      )}
    </div>
  );
}
