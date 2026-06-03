import type { MealType } from './recipe';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface AssignedMeal {
  id: string;
  recipeId: string;
  servingsOverride?: number;
  notes?: string;
  isCooked: boolean;
}

export type DayMeals = Partial<Record<MealType, AssignedMeal>>;

export type WeekPlan = Record<DayOfWeek, DayMeals>;

export interface WeekPlanEntry {
  id: string;
  weekStartDate: string;
  plan: WeekPlan;
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingListItem {
  ingredientName: string;
  totalQuantity: number;
  unit: string;
  recipeIds: string[];
  isChecked: boolean;
}
