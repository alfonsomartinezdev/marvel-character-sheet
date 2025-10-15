export type DieType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12';

export interface Affiliation {
  solo: DieType;
  buddy: DieType;
  team: DieType;
}

export interface Distinction {
  name: string;
  dice: DieType;
  positiveEffect?: string;
}

export interface Power {
  name: string;
  dice: DieType[];
}

export interface SFX {
  name: string;
  description: string;
}

export interface PowerSet {
  name: string;
  powers: Power[];
  sfx: SFX[];
}

export interface Specialty {
  name: string;
  dice: DieType;
}

export interface MilestoneReward {
  xp: number;
  description: string;
}

export interface Milestone {
  name: string;
  rewards: MilestoneReward[];
}

export interface StressTrack {
  current: DieType | null;
  max: DieType;
}

export interface Character {
  name: string;
  pp: number;
  xp: number;
  affiliations: Affiliation;
  distinctions: Distinction[];
  powerSets: PowerSet[];
  specialties: Specialty[];
  milestones: Milestone[];
  stress: {
    physical: StressTrack;
    mental: StressTrack;
    emotional: StressTrack;
  };
}

export interface DicePoolEntry {
  source: string;
  dice: DieType;
}