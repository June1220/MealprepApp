export type AgeGroup = 'infant' | 'toddler' | 'child' | 'teen' | 'adult' | 'senior';

export type DietaryRestriction =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'shellfish-free'
  | 'egg-free'
  | 'soy-free';

export interface FamilyMember {
  id: string;
  name: string;
  ageGroup: AgeGroup;
  avatarUri?: string;
  avatarColor?: string;
  dietaryRestrictions: DietaryRestriction[];
  dislikedIngredients: string[];
  isAdmin: boolean;
}

export interface FamilyProfile {
  id: string;
  familyName?: string;
  members: FamilyMember[];
  defaultServings: number;
  createdAt: string;
  updatedAt: string;
}
