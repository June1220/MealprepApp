import React, { useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet, SafeAreaView } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/constants/theme';
import { WeekStrip } from '@/components/planner/WeekStrip';
import { DayView } from '@/components/planner/DayView';
import { RecipePickerSheet } from '@/components/sheets/RecipePickerSheet';
import { MealOptionsSheet } from '@/components/sheets/MealOptionsSheet';
import { useUIStore } from '@/stores/uiStore';
import { useWeekPlanStore } from '@/stores/weekPlanStore';
import { useRecipeStore } from '@/stores/recipeStore';
import { useWeekPlan } from '@/hooks/useWeekPlan';
import { formatWeekLabel } from '@/utils/dateUtils';
import type { DayOfWeek, MealType, Recipe } from '@/types';

export default function PlannerScreen() {
  const activeDay = useUIStore((s) => s.activeDay);
  const activeWeekStartDate = useUIStore((s) => s.activeWeekStartDate);
  const setActiveDay = useUIStore((s) => s.setActiveDay);
  const goToPreviousWeek = useUIStore((s) => s.goToPreviousWeek);
  const goToNextWeek = useUIStore((s) => s.goToNextWeek);

  const assignMeal = useWeekPlanStore((s) => s.assignMeal);
  const removeMeal = useWeekPlanStore((s) => s.removeMeal);
  const toggleCooked = useWeekPlanStore((s) => s.toggleCooked);
  const weekPlans = useWeekPlanStore((s) => s.weekPlans);
  const getRecipeById = useRecipeStore((s) => s.getRecipeById);

  const { getDayCompletion, filledSlots, totalSlots } = useWeekPlan();

  const pickerRef = useRef<BottomSheet | null>(null);
  const optionsRef = useRef<BottomSheet | null>(null);

  const [pendingDay, setPendingDay] = useState<DayOfWeek | null>(null);
  const [pendingMealType, setPendingMealType] = useState<MealType | null>(null);

  const weekPlan = weekPlans.find((p) => p.weekStartDate === activeWeekStartDate);
  const pendingMeal = pendingDay && pendingMealType
    ? weekPlan?.plan[pendingDay]?.[pendingMealType]
    : null;
  const pendingRecipe = pendingMeal ? getRecipeById(pendingMeal.recipeId) : null;

  const handleAddMeal = useCallback((day: DayOfWeek, mealType: MealType) => {
    setPendingDay(day);
    setPendingMealType(mealType);
    pickerRef.current?.snapToIndex(0);
  }, []);

  const handleMealOptions = useCallback((day: DayOfWeek, mealType: MealType) => {
    setPendingDay(day);
    setPendingMealType(mealType);
    optionsRef.current?.snapToIndex(0);
  }, []);

  const handleRecipeSelect = useCallback((recipe: Recipe) => {
    if (!pendingDay || !pendingMealType) return;
    assignMeal(activeWeekStartDate, pendingDay, pendingMealType, recipe.id);
  }, [pendingDay, pendingMealType, activeWeekStartDate, assignMeal]);

  const handleRemoveMeal = useCallback(() => {
    if (!pendingDay || !pendingMealType) return;
    removeMeal(activeWeekStartDate, pendingDay, pendingMealType);
  }, [pendingDay, pendingMealType, activeWeekStartDate, removeMeal]);

  const handleToggleCooked = useCallback(() => {
    if (!pendingDay || !pendingMealType) return;
    toggleCooked(activeWeekStartDate, pendingDay, pendingMealType);
  }, [pendingDay, pendingMealType, activeWeekStartDate, toggleCooked]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Week Navigator */}
      <View style={styles.weekNav}>
        <Pressable onPress={goToPreviousWeek} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={22} color={colors.stone[900]} />
        </Pressable>
        <View style={styles.weekInfo}>
          <Text style={styles.weekLabel}>{formatWeekLabel(activeWeekStartDate)}</Text>
          <Text style={styles.completionText}>{filledSlots}/{totalSlots} meals planned</Text>
        </View>
        <Pressable onPress={goToNextWeek} hitSlop={12} style={styles.navBtn}>
          <Ionicons name="chevron-forward" size={22} color={colors.stone[900]} />
        </Pressable>
      </View>

      {/* Day Strip */}
      <View style={styles.stripContainer}>
        <WeekStrip
          weekStartDate={activeWeekStartDate}
          activeDay={activeDay}
          onDayPress={setActiveDay}
          getDayCompletion={getDayCompletion}
        />
      </View>

      {/* Day View */}
      <View style={styles.dayViewContainer}>
        <DayView
          day={activeDay}
          weekStartDate={activeWeekStartDate}
          onAddMeal={handleAddMeal}
          onMealOptions={handleMealOptions}
        />
      </View>

      {/* Sheets */}
      <RecipePickerSheet
        sheetRef={pickerRef}
        onSelect={handleRecipeSelect}
        preferredMealType={pendingMealType ?? undefined}
      />
      <MealOptionsSheet
        sheetRef={optionsRef}
        recipeName={pendingRecipe?.title}
        isCooked={pendingMeal?.isCooked}
        onViewRecipe={() => {}}
        onReplace={() => {
          optionsRef.current?.close();
          setTimeout(() => pickerRef.current?.snapToIndex(0), 300);
        }}
        onToggleCooked={handleToggleCooked}
        onRemove={handleRemoveMeal}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.stone[50] },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  navBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
  },
  weekLabel: {
    ...typography.heading,
    color: colors.stone[900],
  },
  completionText: {
    ...typography.caption,
    color: colors.stone[600],
    marginTop: 2,
  },
  stripContainer: {
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.stone[100],
  },
  dayViewContainer: {
    flex: 1,
  },
});
