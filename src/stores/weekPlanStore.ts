import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkvStorage';
import { STORAGE_KEYS } from '@/storage/storageKeys';
import type { WeekPlanEntry, DayOfWeek, MealType, AssignedMeal } from '@/types';
import { getWeekStartDate, generateId } from '@/utils/dateUtils';

interface WeekPlanState {
  weekPlans: WeekPlanEntry[];
  getCurrentWeekPlan: () => WeekPlanEntry;
  getWeekPlan: (weekStartDate: string) => WeekPlanEntry;
  assignMeal: (weekStartDate: string, day: DayOfWeek, mealType: MealType, recipeId: string, servings?: number) => void;
  removeMeal: (weekStartDate: string, day: DayOfWeek, mealType: MealType) => void;
  toggleCooked: (weekStartDate: string, day: DayOfWeek, mealType: MealType) => void;
  copyWeek: (fromWeekStartDate: string, toWeekStartDate: string) => void;
}

const EMPTY_WEEK_PLAN = (): WeekPlanEntry['plan'] => ({
  monday: {},
  tuesday: {},
  wednesday: {},
  thursday: {},
  friday: {},
  saturday: {},
  sunday: {},
});

export const useWeekPlanStore = create<WeekPlanState>()(
  persist(
    (set, get) => ({
      weekPlans: [],

      getCurrentWeekPlan: () => get().getWeekPlan(getWeekStartDate(new Date())),

      getWeekPlan: (weekStartDate) => {
        const existing = get().weekPlans.find((p) => p.weekStartDate === weekStartDate);
        if (existing) return existing;

        const newPlan: WeekPlanEntry = {
          id: generateId(),
          weekStartDate,
          plan: EMPTY_WEEK_PLAN(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ weekPlans: [...state.weekPlans, newPlan] }));
        return newPlan;
      },

      assignMeal: (weekStartDate, day, mealType, recipeId, servings) => {
        const meal: AssignedMeal = {
          id: generateId(),
          recipeId,
          servingsOverride: servings,
          isCooked: false,
        };
        set((state) => {
          const plans = state.weekPlans.map((p) => {
            if (p.weekStartDate !== weekStartDate) return p;
            return {
              ...p,
              plan: {
                ...p.plan,
                [day]: { ...p.plan[day], [mealType]: meal },
              },
              updatedAt: new Date().toISOString(),
            };
          });

          if (!plans.find((p) => p.weekStartDate === weekStartDate)) {
            const newPlan: WeekPlanEntry = {
              id: generateId(),
              weekStartDate,
              plan: { ...EMPTY_WEEK_PLAN(), [day]: { [mealType]: meal } },
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            return { weekPlans: [...plans, newPlan] };
          }
          return { weekPlans: plans };
        });
      },

      removeMeal: (weekStartDate, day, mealType) => {
        set((state) => ({
          weekPlans: state.weekPlans.map((p) => {
            if (p.weekStartDate !== weekStartDate) return p;
            const dayMeals = { ...p.plan[day] };
            delete dayMeals[mealType];
            return {
              ...p,
              plan: { ...p.plan, [day]: dayMeals },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      toggleCooked: (weekStartDate, day, mealType) => {
        set((state) => ({
          weekPlans: state.weekPlans.map((p) => {
            if (p.weekStartDate !== weekStartDate) return p;
            const meal = p.plan[day][mealType];
            if (!meal) return p;
            return {
              ...p,
              plan: {
                ...p.plan,
                [day]: {
                  ...p.plan[day],
                  [mealType]: { ...meal, isCooked: !meal.isCooked },
                },
              },
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
      },

      copyWeek: (fromWeekStartDate, toWeekStartDate) => {
        const source = get().weekPlans.find((p) => p.weekStartDate === fromWeekStartDate);
        if (!source) return;

        const freshPlan = JSON.parse(JSON.stringify(source.plan)) as WeekPlanEntry['plan'];
        // Reset cooked status on the copied week
        (Object.keys(freshPlan) as DayOfWeek[]).forEach((day) => {
          (Object.keys(freshPlan[day]) as MealType[]).forEach((mealType) => {
            const meal = freshPlan[day][mealType];
            if (meal) {
              meal.id = generateId();
              meal.isCooked = false;
            }
          });
        });

        set((state) => {
          const withoutExisting = state.weekPlans.filter((p) => p.weekStartDate !== toWeekStartDate);
          return {
            weekPlans: [
              ...withoutExisting,
              {
                id: generateId(),
                weekStartDate: toWeekStartDate,
                plan: freshPlan,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
          };
        });
      },
    }),
    {
      name: STORAGE_KEYS.WEEK_PLANS,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
