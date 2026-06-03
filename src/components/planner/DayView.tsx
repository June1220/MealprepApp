import React, { useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';
import { MealSlot } from './MealSlot';
import { useRecipeStore } from '@/stores/recipeStore';
import { useWeekPlanStore } from '@/stores/weekPlanStore';
import { formatDayHeading } from '@/utils/dateUtils';
import type { DayOfWeek, MealType } from '@/types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

interface DayViewProps {
  day: DayOfWeek;
  weekStartDate: string;
  onAddMeal: (day: DayOfWeek, mealType: MealType) => void;
  onMealOptions: (day: DayOfWeek, mealType: MealType) => void;
}

export function DayView({ day, weekStartDate, onAddMeal, onMealOptions }: DayViewProps) {
  const weekPlans = useWeekPlanStore((s) => s.weekPlans);
  const toggleCooked = useWeekPlanStore((s) => s.toggleCooked);
  const getRecipeById = useRecipeStore((s) => s.getRecipeById);

  const weekPlan = weekPlans.find((p) => p.weekStartDate === weekStartDate);
  const dayMeals = weekPlan?.plan[day] ?? {};
  const heading = formatDayHeading(day, weekStartDate);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>{heading}</Text>
      <View style={styles.slots}>
        {MEAL_TYPES.map((mealType) => {
          const assignedMeal = dayMeals[mealType];
          const recipe = assignedMeal ? getRecipeById(assignedMeal.recipeId) : undefined;
          return (
            <MealSlot
              key={mealType}
              mealType={mealType}
              assignedMeal={assignedMeal}
              recipe={recipe}
              onPress={() => {
                if (!assignedMeal) {
                  onAddMeal(day, mealType);
                } else {
                  onMealOptions(day, mealType);
                }
              }}
              onLongPress={() => onMealOptions(day, mealType)}
              onToggleCooked={() => toggleCooked(weekStartDate, day, mealType)}
            />
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing[4],
    paddingBottom: spacing[16],
  },
  heading: {
    ...typography.title,
    color: colors.stone[900],
    marginBottom: spacing[4],
  },
  slots: {
    gap: spacing[3],
  },
});
