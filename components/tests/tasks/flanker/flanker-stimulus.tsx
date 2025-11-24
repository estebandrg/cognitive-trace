import { FlankerTrial } from './flanker-types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface FlankerStimulusProps {
  trial: FlankerTrial | null;
  showFeedback?: boolean;
  lastResponse?: { correct: boolean; rt: number } | null;
  onDirectionSelect?: (direction: 'left' | 'right') => void;
}

export function FlankerStimulus({ 
  trial, 
  showFeedback, 
  lastResponse,
  onDirectionSelect 
}: FlankerStimulusProps) {
  return (
    <div className="h-64 flex items-center justify-center">
      {showFeedback ? (
        <div className="space-y-4">
          <div className={`text-4xl font-bold ${lastResponse?.correct ? 'text-green-600' : 'text-red-600'}`}>
            {lastResponse?.correct ? '✓' : '✗'}
          </div>
          {lastResponse && (
            <div className="text-sm text-slate-600 dark:text-slate-400">
              {lastResponse.rt}ms
            </div>
          )}
        </div>
      ) : trial ? (
        <div className="space-y-8">
          <div className="text-6xl font-mono tracking-wider">
            {trial.arrows}
          </div>
          
          <div className="flex justify-center gap-8">
            <button
              onClick={() => onDirectionSelect?.('left')}
              onTouchStart={(e) => {
                e.preventDefault();
                onDirectionSelect?.('left');
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-150 active:scale-95 active:bg-blue-100 dark:active:bg-blue-900/30 cursor-pointer select-none"
            >
              <ArrowLeft size={24} className="text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Left</span>
            </button>
            
            <button
              onClick={() => onDirectionSelect?.('right')}
              onTouchStart={(e) => {
                e.preventDefault();
                onDirectionSelect?.('right');
              }}
              className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-150 active:scale-95 active:bg-blue-100 dark:active:bg-blue-900/30 cursor-pointer select-none"
            >
              <ArrowRight size={24} className="text-slate-600 dark:text-slate-400" />
              <span className="text-sm text-slate-600 dark:text-slate-400">Right</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-4xl text-slate-400">+</div>
      )}
    </div>
  );
}
