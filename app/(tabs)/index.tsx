import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '@/constants/theme';
import { useTodayMeals } from '@/hooks/useTodayMeals';
import { useWeekPlan } from '@/hooks/useWeekPlan';
import { useRecipeStore } from '@/stores/recipeStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useFamilyStore } from '@/stores/familyStore';
import { WeekStrip } from '@/components/planner/WeekStrip';
import { RecipeCard } from '@/components/cards/RecipeCard';
import { MEAL_TYPE_LABELS, MEAL_TYPE_ICONS } from '@/constants/mealTypes';
import { sampleRecipes } from '@/seeds/sampleRecipes';
import { useUIStore } from '@/stores/uiStore';
import type { DayOfWeek } from '@/types';

export default function HomeScreen() {
  const router = useRouter();
  const todayMeals = useTodayMeals();
  const { weekPlan, activeWeekStartDate, completionPercentage, getDayCompletion } = useWeekPlan();
  const recipes = useRecipeStore((s) => s.recipes);
  const seedRecipes = useRecipeStore((s) => s.seedRecipes);
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);
  const { isComplete: onboardingComplete, recipesSeeded, markRecipesSeeded } = useOnboardingStore();
  const family = useFamilyStore((s) => s.family);
  const setActiveDay = useUIStore((s) => s.setActiveDay);
  const activeDay = useUIStore((s) => s.activeDay);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Seed recipes on first load
  useEffect(() => {
    if (!recipesSeeded) {
      seedRecipes(sampleRecipes);
      markRecipesSeeded();
    }
  }, [recipesSeeded, seedRecipes, markRecipesSeeded]);

  const recentRecipes = recipes.filter((r) => r.isFavorite).slice(0, 5);
  const displayRecipes = recentRecipes.length > 0 ? recentRecipes : recipes.slice(0, 5);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.greeting}>
              {greeting()}{family.familyName ? `, ${family.familyName}` : ''}!
            </Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Ionicons name="notifications-outline" size={24} color={colors.stone[600]} />
          </View>
        </View>

        {/* Today's Meals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Meals</Text>
          <View style={styles.todayCard}>
            {todayMeals.map(({ mealType, assignedMeal, recipe }) => (
              <Pressable
                key={mealType}
                style={({ pressed }) => [styles.todayRow, pressed && styles.pressed]}
                onPress={() => router.push('/planner')}
              >
                <Ionicons
                  name={MEAL_TYPE_ICONS[mealType] as any}
                  size={18}
                  color={assignedMeal ? colors.primary[400] : colors.stone[300]}
                />
                <Text style={styles.mealTypeLabel}>{MEAL_TYPE_LABELS[mealType]}</Text>
                {recipe ? (
                  <Text style={styles.recipeName} numberOfLines={1}>{recipe.title}</Text>
                ) : (
                  <Text style={styles.notPlanned}>Not planned</Text>
                )}
                {assignedMeal?.isCooked && (
                  <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Week at a Glance */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>This Week</Text>
            <Text style={styles.completionBadge}>{completionPercentage}% planned</Text>
          </View>
          <WeekStrip
            weekStartDate={activeWeekStartDate}
            activeDay={activeDay}
            onDayPress={(day) => {
              setActiveDay(day);
              router.push('/planner');
            }}
            getDayCompletion={getDayCompletion}
          />
        </View>

        {/* Favorite / Recent Recipes */}
        {displayRecipes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {recentRecipes.length > 0 ? 'Favorite Recipes' : 'Browse Recipes'}
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipesRow}
            >
              {displayRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onPress={() => router.push({ pathname: '/(modal)/recipe-detail', params: { id: recipe.id } })}
                  onFavoritePress={() => toggleFavorite(recipe.id)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Empty state - no recipes yet */}
        {recipes.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>Plan your first week</Text>
            <Text style={styles.emptyDesc}>Head to the Planner tab to start assigning meals to your week.</Text>
            <Pressable
              style={styles.emptyBtn}
              onPress={() => router.push('/planner')}
            >
              <Text style={styles.emptyBtnText}>Go to Planner</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.stone[50] },
  scroll: { flex: 1 },
  content: { paddingBottom: spacing[16] },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },
  headerText: { flex: 1 },
  headerRight: { paddingTop: 4 },
  greeting: {
    ...typography.title,
    color: colors.stone[900],
  },
  date: {
    ...typography.bodySm,
    color: colors.stone[600],
    marginTop: 2,
  },
  section: {
    marginBottom: spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  sectionTitle: {
    ...typography.heading,
    color: colors.stone[900],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[3],
  },
  completionBadge: {
    ...typography.caption,
    color: colors.primary[600],
    fontFamily: 'Inter_600SemiBold',
    backgroundColor: colors.primary[100],
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  todayCard: {
    marginHorizontal: spacing[4],
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    gap: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.stone[100],
    minHeight: 52,
  },
  pressed: { backgroundColor: colors.stone[50] },
  mealTypeLabel: {
    ...typography.label,
    color: colors.stone[600],
    width: 70,
  },
  recipeName: {
    flex: 1,
    ...typography.bodySm,
    fontFamily: 'Inter_500Medium',
    color: colors.stone[900],
  },
  notPlanned: {
    flex: 1,
    ...typography.bodySm,
    color: colors.stone[300],
    fontStyle: 'italic',
  },
  recipesRow: {
    paddingHorizontal: spacing[4],
    gap: spacing[3],
  },
  emptyCard: {
    margin: spacing[4],
    backgroundColor: colors.primary[50],
    borderRadius: radius.md,
    padding: spacing[6],
    alignItems: 'center',
  },
  emptyEmoji: { fontSize: 48, marginBottom: spacing[3] },
  emptyTitle: { ...typography.heading, color: colors.stone[900], marginBottom: spacing[2] },
  emptyDesc: {
    ...typography.body,
    color: colors.stone[600],
    textAlign: 'center',
    marginBottom: spacing[4],
  },
  emptyBtn: {
    backgroundColor: colors.primary[400],
    borderRadius: radius.full,
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
  },
  emptyBtnText: {
    ...typography.label,
    color: colors.white,
    fontSize: 15,
  },
});
