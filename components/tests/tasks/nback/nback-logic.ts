import { TestLogic } from '@/lib/types/test-system';
import { NBackResult, Response } from '@/lib/types/tests';
import { NBackTrial } from './nback-types';
import { NBACK_CONSTANTS } from './nback-config';

export const nbackLogic: TestLogic<NBackResult, NBackTrial> = {
  generateSequence: (config) => {
    const { totalTrials } = config;
    const { N_BACK, LETTERS, TARGET_FREQUENCY } = NBACK_CONSTANTS;
    const sequence: string[] = [];
    
    for (let i = 0; i < N_BACK; i++) {
      sequence.push(LETTERS[Math.floor(Math.random() * LETTERS.length)]);
    }
    
    for (let i = N_BACK; i < totalTrials; i++) {
      if (Math.random() < TARGET_FREQUENCY) {
        sequence.push(sequence[i - N_BACK]);
      } else {
        let letter;
        do {
          letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        } while (letter === sequence[i - N_BACK]);
        sequence.push(letter);
      }
    }
    
    return sequence.map((letter, position) => ({
      letter,
      isTarget: position >= N_BACK && letter === sequence[position - N_BACK],
      position,
    }));
  },

  validateResponse: (trial, input) => {
    // Correct if: (target AND response) OR (non-target AND no response)
    if (trial.isTarget) {
      return input.hasResponse; // Hit if responded, Miss if not
    } else {
      return !input.hasResponse; // Correct Rejection if not responded, False Positive if responded
    }
  },

  calculateResults: (responses, config, sequence) => {
    const { N_BACK } = NBACK_CONSTANTS;
    let hits = 0;
    let misses = 0;
    let falsePositives = 0;
    let correctRejections = 0;
    
    // Match responses to trials by stimulus (letter)
    for (let i = 0; i < sequence.length; i++) {
      const trial = sequence[i];
      
      // Find response for this trial by matching the letter
      const response = responses.find(r => {
        try {
          const parsedStimulus = JSON.parse(r.stimulus as string);
          return parsedStimulus.letter === trial.letter && parsedStimulus.position === trial.position;
        } catch {
          return false;
        }
      });
      
      const responded = response !== undefined;
      
      if (trial.isTarget) {
        // Target trial - should respond
        if (responded && response.correct) {
          hits++;
        } else {
          misses++;
        }
      } else {
        // Non-target trial - should NOT respond
        if (responded) {
          falsePositives++;
        } else {
          correctRejections++;
        }
      }
    }
    
    const validResponses = responses.filter(r => r.responseTime < config.stimulusDuration && r.responseTime > 100);
    const averageRT = validResponses.length > 0 
      ? validResponses.reduce((sum, r) => sum + r.responseTime, 0) / validResponses.length 
      : 0;
    
    const accuracy = (hits + correctRejections) / sequence.length;
    
    return {
      testType: 'nback',
      startTime: 0,
      endTime: 0,
      duration: 0,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      hits,
      falsePositives,
      misses,
      correctRejections,
    };
  },
};
