import { Response } from '@/lib/types/tests';

/**
 * Calculate average reaction time from responses
 */
export function calculateAverageRT(
  responses: Response[],
  minRT = 100,
  maxRT = 3000
): number {
  const validRTs = responses
    .filter(r => r.responseTime >= minRT && r.responseTime <= maxRT)
    .map(r => r.responseTime);
  
  return validRTs.length > 0
    ? validRTs.reduce((sum, rt) => sum + rt, 0) / validRTs.length
    : 0;
}

/**
 * Calculate standard deviation
 */
export function calculateStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / (values.length - 1);
  
  return Math.sqrt(variance);
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(
  correct: number,
  total: number
): number {
  return total > 0 ? correct / total : 0;
}

/**
 * Shuffle array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Format time duration
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${seconds}s`;
}

/**
 * Get valid reaction times within acceptable range
 */
export function getValidRTs(
  responses: Response[],
  minRT = 100,
  maxRT = 3000
): number[] {
  return responses
    .filter(r => r.correct && r.responseTime >= minRT && r.responseTime <= maxRT)
    .map(r => r.responseTime);
}
