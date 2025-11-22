import { TestLogic } from '@/lib/types/test-system';
import { FlankerResult, Response } from '@/lib/types/tests';
import { FlankerTrial } from './flanker-types';
import { shuffleArray } from '../../shared/utils';

export const flankerLogic: TestLogic<FlankerResult, FlankerTrial> = {
  generateSequence: (config) => {
    const trials: FlankerTrial[] = [];
    const { totalTrials } = config;
    const congruentTrials = totalTrials / 2;
    
    for (let i = 0; i < congruentTrials / 2; i++) {
      trials.push({
        arrows: '← ← ← ← ←',
        targetDirection: 'left',
        type: 'congruent'
      });
      trials.push({
        arrows: '→ → → → →',
        targetDirection: 'right',
        type: 'congruent'
      });
    }
    
    for (let i = 0; i < congruentTrials / 2; i++) {
      trials.push({
        arrows: '→ → ← → →',
        targetDirection: 'left',
        type: 'incongruent'
      });
      trials.push({
        arrows: '← ← → ← ←',
        targetDirection: 'right',
        type: 'incongruent'
      });
    }
    
    return shuffleArray(trials);
  },

  validateResponse: (trial, input) => {
    const responseDirection = input.key;
    if (!responseDirection) return false;
    
    // Normalize arrow key inputs
    const direction = responseDirection === 'ArrowLeft' ? 'left' : 
                     responseDirection === 'ArrowRight' ? 'right' : 
                     responseDirection;
    
    return direction === trial.targetDirection;
  },

  calculateResults: (responses, config, sequence) => {
    const validResponses = responses.filter(r => r.responseTime < config.stimulusDuration && r.responseTime > 100);
    const correctResponses = validResponses.filter(r => r.correct);
    
    const congruentResponses = validResponses.filter(r => {
      const stimulus = JSON.parse(r.stimulus as string);
      return stimulus.type === 'congruent' && r.correct;
    });
    
    const incongruentResponses = validResponses.filter(r => {
      const stimulus = JSON.parse(r.stimulus as string);
      return stimulus.type === 'incongruent' && r.correct;
    });
    
    const congruentRT = congruentResponses.length > 0 
      ? congruentResponses.reduce((sum, r) => sum + r.responseTime, 0) / congruentResponses.length 
      : 0;
    
    const incongruentRT = incongruentResponses.length > 0 
      ? incongruentResponses.reduce((sum, r) => sum + r.responseTime, 0) / incongruentResponses.length 
      : 0;
    
    const interferenceEffect = incongruentRT - congruentRT;
    
    const averageRT = correctResponses.length > 0 
      ? correctResponses.reduce((sum, r) => sum + r.responseTime, 0) / correctResponses.length 
      : 0;
    
    const accuracy = responses.length > 0 ? correctResponses.length / responses.length : 0;
    
    return {
      testType: 'flanker',
      startTime: 0,
      endTime: 0,
      duration: 0,
      accuracy,
      averageReactionTime: averageRT,
      responses,
      congruentRT,
      incongruentRT,
      interferenceEffect,
    };
  },
};
