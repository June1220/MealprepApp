import { useMemo } from 'react';
import { useWeekPlanStore } from '@/stores/weekPlanStore';
import { useUIStore } from '@/stores/uiStore';
import type { DayOfWeek, MealType } from '@/types';

const DAYS: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

export function useWeekPlan() {
  const activeWeekStartDate = useUIStore((s) => s.activeWeekStartDate);
  const weekPlans = useWeekPlanStore((s) => s.weekPlans);

  const weekPlan = useMemo(
    () => weekPlans.find((p) => p.weekStartDate === activeWeekStartDate),
    [weekPlans, activeWeekStartDate]
  );

  const totalSlots = DAYS.length * MEAL_TYPES.length;
  const filledSlots = useMemo(() => {
    if (!weekPlan) return 0;
    return DAYS.reduce((count, day) => {
      return count + MEAL_TYPES.filter((mt) => weekPlan.plan[day][mt]).length;
    }, 0);
  }, [weekPlan]);

  const completionPercentage = Math.round((filledSlots / totalSlots) * 100);

  const getDayCompletion = (day: DayOfWeek): { filled: number; total: number } => {
    if (!weekPlan) return { filled: 0, total: MEAL_TYPES.length };
    const filled = MEAL_TYPES.filter((mt) => weekPlan.plan[day][mt]).length;
    return { filled, total: MEAL_TYPES.length };
  };

  return {
    weekPlan,
    activeWeekStartDate,
    filledSlots,
    totalSlots,
    completionPercentage,
    getDayCompletion,
  };
}
