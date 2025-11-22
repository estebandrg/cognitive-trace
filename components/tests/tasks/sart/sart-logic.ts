import { TestLogic } from '@/lib/types/test-system';
import { SARTResult, Response } from '@/lib/types/tests';
import { SART_CONSTANTS } from './sart-config';
import { SARTTrial } from './sart-types';
import { calculateStdDev, getValidRTs } from '../../shared/utils';

export const sartLogic: TestLogic<SARTResult, SARTTrial> = {
  generateSequence: (config) => {
    const sequence: SARTTrial[] = [];
    const { totalTrials } = config;
    const { NO_GO_NUMBER, NO_GO_FREQUENCY, VALID_NUMBERS } = SART_CONSTANTS;
    
    for (let i = 0; i < totalTrials; i++) {
      if (Math.random() < NO_GO_FREQUENCY) {
        sequence.push({ number: NO_GO_NUMBER, isNoGo: true });
      } else {
        const number = VALID_NUMBERS[Math.floor(Math.random() * VALID_NUMBERS.length)];
        sequence.push({ number, isNoGo: false });
      }
    }
    
    return sequence;
  },

  validateResponse: (trial, input) => {
    // Response is correct if user responds to non-no-go numbers
    return input.hasResponse && !trial.isNoGo;
  },

  calculateResults: (responses, config, sequence) => {
    const { NO_GO_NUMBER } = SART_CONSTANTS;
    
    // Separate go and no-go responses
    const goTrials = responses.filter(r => Number(r.stimulus) !== NO_GO_NUMBER || 
                                            (typeof r.stimulus === 'string' && !r.stimulus.includes(String(NO_GO_NUMBER))));
    const noGoResponses = responses.filter(r => Number(r.stimulus) === NO_GO_NUMBER ||
                                                  (typeof r.stimulus === 'string' && r.stimulus.includes(String(NO_GO_NUMBER))));
    
    // Calculate metrics
    const totalGoTrials = sequence.filter(t => !t.isNoGo).length;
    const hits = goTrials.filter(r => r.correct).length;
    const omissions = totalGoTrials - hits;
    const commissions = noGoResponses.length;
    
    // Calculate RT statistics
    const validRTs = getValidRTs(goTrials);
    const averageRT = validRTs.length > 0 
      ? validRTs.reduce((a, b) => a + b, 0) / validRTs.length 
      : 0;
    
    const rtVariability = calculateStdDev(validRTs);
    const accuracy = totalGoTrials > 0 ? hits / totalGoTrials : 0;
    
    return {
      testType: 'sart',
      startTime: 0, // Will be set by TestRunner
      endTime: 0,
      duration: 0,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      omissions,
      commissions,
      reactionTimeVariability: rtVariability,
    };
  },
};
