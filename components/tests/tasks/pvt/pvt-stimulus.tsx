import { Button } from '@/components/ui/button';

interface PVTStimulusProps {
  isWaiting: boolean;
  showStimulus: boolean;
  showFeedback: boolean;
  showResponseFeedback?: boolean;
  falseStart: boolean;
  lastRT: number | null;
  onResponse?: () => void;
}

export function PVTStimulus({ 
  isWaiting,
  showStimulus, 
  showFeedback,
  showResponseFeedback,
  falseStart,
  lastRT,
  onResponse
}: PVTStimulusProps) {
  return (
    <div className="h-96 flex items-center justify-center">
      {showFeedback ? (
        <div className="space-y-4">
          {falseStart ? (
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                False Start!
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Wait for the stimulus to appear
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {lastRT}ms
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                {lastRT && lastRT < 300 ? 'Excellent!' : 
                 lastRT && lastRT < 400 ? 'Good!' : 
                 lastRT && lastRT < 500 ? 'Fair' : 'Slow'}
              </p>
            </div>
          )}
        </div>
      ) : showStimulus ? (
        <div className="relative">
          {showResponseFeedback && (
            <div className="absolute inset-0 bg-orange-500/30 rounded-full animate-ping pointer-events-none z-10" />
          )}
          <Button
            onClick={onResponse}
            onTouchStart={(e) => {
              e.preventDefault();
              onResponse?.();
            }}
            size="lg"
            className={`w-64 h-64 text-4xl font-bold bg-red-500 hover:bg-red-600 text-white rounded-full animate-pulse transition-all duration-150 ${
              showResponseFeedback ? 'scale-110 bg-orange-500' : ''
            }`}
          >
            CLICK!
          </Button>
        </div>
      ) : isWaiting ? (
        <div className="flex flex-col items-center">
          <div className="w-64 h-64 border-4 border-blue-400 dark:border-blue-500 rounded-full flex items-center justify-center transition-colors animate-pulse">
            <div className="text-2xl font-semibold text-slate-600 dark:text-slate-400">
              Wait...
            </div>
          </div>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Get ready to respond
          </p>
        </div>
      ) : (
        <div className="text-4xl text-slate-400">+</div>
      )}
    </div>
  );
}
