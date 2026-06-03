import type { DietaryTag, DietaryRestriction } from '@/types';

export const DIETARY_TAGS: DietaryTag[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'kid-approved',
  'low-carb',
  'high-protein',
];

export const DIETARY_TAG_LABELS: Record<DietaryTag, string> = {
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
  'kid-approved': 'Kid Approved',
  'low-carb': 'Low Carb',
  'high-protein': 'High Protein',
};

export const DIETARY_RESTRICTIONS: DietaryRestriction[] = [
  'vegetarian',
  'vegan',
  'gluten-free',
  'dairy-free',
  'nut-free',
  'shellfish-free',
  'egg-free',
  'soy-free',
];

export const DIETARY_RESTRICTION_LABELS: Record<DietaryRestriction, string> = {
  'vegetarian': 'Vegetarian',
  'vegan': 'Vegan',
  'gluten-free': 'Gluten-Free',
  'dairy-free': 'Dairy-Free',
  'nut-free': 'Nut-Free',
  'shellfish-free': 'Shellfish-Free',
  'egg-free': 'Egg-Free',
  'soy-free': 'Soy-Free',
};
