import type { TestResult, SARTResult, FlankerResult, NBackResult, PVTResult } from '@/lib/types/tests';

export const calculateOverallScore = (results: TestResult[]): number => {
  if (results.length === 0) return 0;

  let totalScore = 0;
  let validTests = 0;

  results.forEach(result => {
    let testScore = 0;
    
    switch (result.testType) {
      case 'sart':
        const sartResult = result as SARTResult;
        testScore = sartResult.accuracy * 100;
        break;
      case 'flanker':
        const flankerResult = result as FlankerResult;
        testScore = flankerResult.accuracy * 100;
        break;
      case 'nback':
        const nbackResult = result as NBackResult;
        testScore = (nbackResult.hits / (nbackResult.hits + nbackResult.misses)) * 100;
        break;
      case 'pvt':
        const pvtResult = result as PVTResult;
        // PVT scoring: lower RT is better, penalize lapses
        const baseScore = Math.max(0, 100 - (pvtResult.averageReactionTime - 200) / 10);
        testScore = Math.max(0, baseScore - (pvtResult.lapses * 10));
        break;
    }
    
    if (!isNaN(testScore)) {
      totalScore += testScore;
      validTests++;
    }
  });

  return validTests > 0 ? totalScore / validTests : 0;
};

export const getPerformanceLevel = (score: number): string => {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
};
