export type TrialType = 'congruent' | 'incongruent';
export type Direction = 'left' | 'right';

export interface FlankerTrial {
  arrows: string;
  targetDirection: Direction;
  type: TrialType;
}
