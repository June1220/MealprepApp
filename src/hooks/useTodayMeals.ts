import { useMemo } from 'react';
import { useWeekPlanStore } from '@/stores/weekPlanStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { getWeekStartDate, formatDayOfWeek } from '@/utils/dateUtils';
import type { MealType, Recipe, AssignedMeal } from '@/types';

export interface MealWithRecipe {
  mealType: MealType;
  assignedMeal: AssignedMeal | undefined;
  recipe: Recipe | undefined;
}

export function useTodayMeals(): MealWithRecipe[] {
  const today = new Date();
  const weekStartDate = getWeekStartDate(today);
  const dayOfWeek = formatDayOfWeek(today);

  const weekPlans = useWeekPlanStore((s) => s.weekPlans);
  const getRecipeById = useRecipeStore((s) => s.getRecipeById);

  return useMemo(() => {
    const weekPlan = weekPlans.find((p) => p.weekStartDate === weekStartDate);
    const dayMeals = weekPlan?.plan[dayOfWeek] ?? {};

    const mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
    return mealTypes.map((mealType) => {
      const assignedMeal = dayMeals[mealType];
      return {
        mealType,
        assignedMeal,
        recipe: assignedMeal ? getRecipeById(assignedMeal.recipeId) : undefined,
      };
    });
  }, [weekPlans, weekStartDate, dayOfWeek, getRecipeById]);
}
