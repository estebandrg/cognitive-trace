import { useEffect, useCallback } from 'react';
import { InputConfig, InputEvent } from '@/lib/types/test-system';

interface UseTestInputProps {
  config: InputConfig;
  onInput: (event: InputEvent) => void;
  enabled: boolean;
}

export function useTestInput({ config, onInput, enabled }: UseTestInputProps) {
  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled || !config.keyboard?.enabled) return;

      const allowedKeys = config.keyboard.keys || ['Space'];
      const key = event.code || event.key;

      if (allowedKeys.includes(key)) {
        event.preventDefault();
        onInput({
          type: 'keyboard',
          key,
          timestamp: Date.now(),
          hasResponse: true,
        });
      }
    },
    [config, onInput, enabled]
  );

  const handleTouch = useCallback(() => {
    if (!enabled || !config.touch?.enabled) return;

    onInput({
      type: 'touch',
      timestamp: Date.now(),
      hasResponse: true,
    });
  }, [config, onInput, enabled]);

  const handleClick = useCallback(() => {
    if (!enabled || !config.click?.enabled) return;

    onInput({
      type: 'click',
      timestamp: Date.now(),
      hasResponse: true,
    });
  }, [config, onInput, enabled]);

  // Setup keyboard listener
  useEffect(() => {
    if (config.keyboard?.enabled) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress, config.keyboard?.enabled]);

  return { 
    handleTouch,
    handleClick,
  };
}
