import { NBackTrial } from './nback-types';

interface NBackStimulusProps {
  trial: NBackTrial | null;
  showFeedback?: boolean;
  showResponseFeedback?: boolean;
  lastResponse?: { correct: boolean; isMatch: boolean } | null;
}

export function NBackStimulus({ 
  trial, 
  showFeedback, 
  showResponseFeedback,
  lastResponse 
}: NBackStimulusProps) {
  return (
    <div className="h-64 flex items-center justify-center relative">
      {showResponseFeedback && (
        <div className="absolute inset-0 bg-purple-500/20 rounded-lg animate-ping pointer-events-none" />
      )}
      
      {showFeedback ? (
        <div className="space-y-4">
          <div className={`text-4xl font-bold ${lastResponse?.correct ? 'text-green-600' : 'text-red-600'}`}>
            {lastResponse?.correct ? '✓' : '✗'}
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {lastResponse?.isMatch ? 'Match!' : 'No match'}
          </div>
        </div>
      ) : trial ? (
        <div className={`text-9xl font-bold text-slate-900 dark:text-slate-100 font-mono transition-all duration-150 ${
          showResponseFeedback ? 'scale-110 text-purple-600 dark:text-purple-400' : ''
        }`}>
          {trial.letter}
        </div>
      ) : (
        <div className="text-4xl text-slate-400">+</div>
      )}
    </div>
  );
}
