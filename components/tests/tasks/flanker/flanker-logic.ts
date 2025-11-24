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
    // Separate responses by trial type
    const congruentTrials = sequence.filter(t => t.type === 'congruent');
    const incongruentTrials = sequence.filter(t => t.type === 'incongruent');
    
    const congruentResponses = responses.filter((r, idx) => sequence[idx]?.type === 'congruent');
    const incongruentResponses = responses.filter((r, idx) => sequence[idx]?.type === 'incongruent');
    
    // Calculate correct responses
    const totalCorrect = responses.filter(r => r.correct).length;
    const congruentCorrect = congruentResponses.filter(r => r.correct);
    const incongruentCorrect = incongruentResponses.filter(r => r.correct);
    
    // Filter only correct responses with valid RTs for RT calculations
    const validCorrectResponses = responses.filter(r => 
      r.correct && r.responseTime < config.stimulusDuration && r.responseTime > 100
    );
    
    const congruentValidCorrect = congruentCorrect.filter(r => 
      r.responseTime < config.stimulusDuration && r.responseTime > 100
    );
    
    const incongruentValidCorrect = incongruentCorrect.filter(r => 
      r.responseTime < config.stimulusDuration && r.responseTime > 100
    );
    
    // Calculate RTs (only from correct responses with valid RTs)
    const congruentRT = congruentValidCorrect.length > 0 
      ? congruentValidCorrect.reduce((sum, r) => sum + r.responseTime, 0) / congruentValidCorrect.length 
      : 0;
    
    const incongruentRT = incongruentValidCorrect.length > 0 
      ? incongruentValidCorrect.reduce((sum, r) => sum + r.responseTime, 0) / incongruentValidCorrect.length 
      : 0;
    
    const interferenceEffect = incongruentRT - congruentRT;
    
    const averageRT = validCorrectResponses.length > 0 
      ? validCorrectResponses.reduce((sum, r) => sum + r.responseTime, 0) / validCorrectResponses.length 
      : 0;
    
    // Accuracy: correct responses / total trials
    const totalTrials = sequence.length;
    const accuracy = totalTrials > 0 ? totalCorrect / totalTrials : 0;
    
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
