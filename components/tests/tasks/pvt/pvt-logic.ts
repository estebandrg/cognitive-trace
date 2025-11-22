import { TestLogic } from '@/lib/types/test-system';
import { PVTResult, Response } from '@/lib/types/tests';
import { PVTTrial } from './pvt-types';
import { PVT_CONSTANTS } from './pvt-config';

export const pvtLogic: TestLogic<PVTResult, PVTTrial> = {
  generateSequence: (config) => {
    const { totalTrials } = config;
    const { MIN_WAIT_TIME, MAX_WAIT_TIME } = PVT_CONSTANTS;
    const trials: PVTTrial[] = [];
    
    for (let i = 0; i < totalTrials; i++) {
      const waitTime = MIN_WAIT_TIME + Math.random() * (MAX_WAIT_TIME - MIN_WAIT_TIME);
      trials.push({
        trialNumber: i + 1,
        waitTime: Math.floor(waitTime),
      });
    }
    
    return trials;
  },

  validateResponse: (trial, input) => {
    return input.hasResponse && input.responseTime !== undefined && input.responseTime > 100;
  },

  calculateResults: (responses, config, sequence) => {
    const { LAPSE_THRESHOLD } = PVT_CONSTANTS;
    
    const validResponses = responses.filter(r => r.responseTime < config.stimulusDuration && r.responseTime > 100);
    const lapses = validResponses.filter(r => r.responseTime > LAPSE_THRESHOLD).length;
    const falseStarts = responses.length - validResponses.length;
    
    const reactionTimes = validResponses.map(r => r.responseTime);
    const averageRT = reactionTimes.length > 0 
      ? reactionTimes.reduce((sum, rt) => sum + rt, 0) / reactionTimes.length 
      : 0;
    
    const minRT = reactionTimes.length > 0 ? Math.min(...reactionTimes) : 0;
    const maxRT = reactionTimes.length > 0 ? Math.max(...reactionTimes) : 0;
    const accuracy = validResponses.filter(r => r.correct).length / config.totalTrials;
    
    return {
      testType: 'pvt',
      startTime: 0,
      endTime: 0,
      duration: 0,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      lapses,
      minRT,
      maxRT,
      falseStarts,
    };
  },
};
