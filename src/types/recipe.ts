export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'nut-free'
  | 'kid-approved'
  | 'low-carb'
  | 'high-protein';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes?: string;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMinutes?: number;
}

export interface NutritionInfo {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
}

export interface Recipe {
  id: string;
  title: string;
  description?: string;
  imageUri?: string;
  mealTypes: MealType[];
  tags: DietaryTag[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  nutrition?: NutritionInfo;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  source?: string;
}
