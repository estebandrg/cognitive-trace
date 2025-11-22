import { ReactNode } from 'react';

interface TestStimulusProps {
  children: ReactNode;
  show: boolean;
  onInteraction?: () => void;
  enableTouch?: boolean;
  enableClick?: boolean;
}

export function TestStimulus({ 
  children, 
  show, 
  onInteraction,
  enableTouch = true,
  enableClick = true,
}: TestStimulusProps) {
  if (!show) return null;

  return (
    <div 
      className="relative min-h-[400px] flex items-center justify-center cursor-pointer select-none"
      onClick={enableClick ? onInteraction : undefined}
      onTouchStart={enableTouch ? (e) => {
        e.preventDefault();
        onInteraction?.();
      } : undefined}
    >
      {children}
    </div>
  );
}
