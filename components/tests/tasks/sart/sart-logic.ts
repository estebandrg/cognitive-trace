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
    // For go trials (not 3): correct if user responds
    // For no-go trials (3): correct if user does NOT respond
    if (trial.isNoGo) {
      // No-go trial: correct = no response
      return !input.hasResponse;
    } else {
      // Go trial: correct = response given
      return input.hasResponse;
    }
  },

  calculateResults: (responses, config, sequence) => {
    const { NO_GO_NUMBER } = SART_CONSTANTS;
    
    // Separate go and no-go trials from sequence
    const goSequence = sequence.filter(t => !t.isNoGo);
    const noGoSequence = sequence.filter(t => t.isNoGo);
    
    // Filter responses by trial type
    const goResponses = responses.filter((r, idx) => !sequence[idx]?.isNoGo);
    const noGoResponses = responses.filter((r, idx) => sequence[idx]?.isNoGo);
    
    // Calculate metrics
    const totalGoTrials = goSequence.length;
    const totalNoGoTrials = noGoSequence.length;
    
    // Hits: correct responses to go trials
    const hits = goResponses.filter(r => r.correct).length;
    
    // Omissions: missed go trials (incorrect responses to go trials)
    const omissions = goResponses.filter(r => !r.correct).length;
    
    // Commissions: incorrect responses to no-go trials (pressing when shouldn't)
    const commissions = noGoResponses.filter(r => !r.correct).length;
    
    // Calculate RT statistics (only from correct go responses)
    const correctGoResponses = goResponses.filter(r => r.correct);
    const validRTs = getValidRTs(correctGoResponses);
    const averageRT = validRTs.length > 0 
      ? validRTs.reduce((a, b) => a + b, 0) / validRTs.length 
      : 0;
    
    const rtVariability = calculateStdDev(validRTs);
    
    // Accuracy: total correct responses / total trials
    const totalCorrect = responses.filter(r => r.correct).length;
    const totalTrials = sequence.length;
    const accuracy = totalTrials > 0 ? totalCorrect / totalTrials : 0;
    
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
