import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import { MEAL_TYPE_ICONS, MEAL_TYPE_LABELS } from '@/constants/mealTypes';
import type { MealType, Recipe, AssignedMeal } from '@/types';

interface MealSlotProps {
  mealType: MealType;
  assignedMeal?: AssignedMeal;
  recipe?: Recipe;
  onPress: () => void;
  onLongPress?: () => void;
  onToggleCooked?: () => void;
}

export function MealSlot({ mealType, assignedMeal, recipe, onPress, onLongPress, onToggleCooked }: MealSlotProps) {
  if (!assignedMeal || !recipe) {
    return (
      <Pressable onPress={onPress} style={styles.emptySlot}>
        <Ionicons name={MEAL_TYPE_ICONS[mealType] as any} size={20} color={colors.stone[300]} />
        <Text style={styles.emptyLabel}>{MEAL_TYPE_LABELS[mealType]}</Text>
        <Text style={styles.addHint}>Tap to add</Text>
        <View style={styles.addIcon}>
          <Ionicons name="add" size={18} color={colors.primary[400]} />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.filledSlot, assignedMeal.isCooked && styles.cookedSlot]}
    >
      <View style={styles.thumbnail}>
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.thumbnailImage} />
        ) : (
          <Text style={styles.thumbnailEmoji}>🍽️</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.mealTypeLabel}>{MEAL_TYPE_LABELS[mealType]}</Text>
        <Text style={styles.recipeName} numberOfLines={1}>{recipe.title}</Text>
        <Text style={styles.metaText}>
          {recipe.prepTimeMinutes + recipe.cookTimeMinutes}m · {assignedMeal.servingsOverride ?? recipe.servings} servings
        </Text>
      </View>
      <Pressable
        onPress={onToggleCooked}
        hitSlop={8}
        style={[styles.cookedToggle, assignedMeal.isCooked && styles.cookedToggleActive]}
      >
        <Ionicons
          name={assignedMeal.isCooked ? 'checkmark-circle' : 'checkmark-circle-outline'}
          size={24}
          color={assignedMeal.isCooked ? colors.success : colors.stone[300]}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  emptySlot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    minHeight: 64,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.stone[300],
    gap: spacing[3],
  },
  emptyLabel: {
    ...typography.label,
    color: colors.stone[600],
    flex: 1,
  },
  addHint: {
    ...typography.caption,
    color: colors.stone[300],
  },
  addIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  filledSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    minHeight: 76,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    ...shadows.sm,
    gap: spacing[3],
  },
  cookedSlot: {
    backgroundColor: colors.accent[100],
  },
  thumbnail: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  thumbnailImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbnailEmoji: { fontSize: 28 },
  content: { flex: 1 },
  mealTypeLabel: {
    ...typography.caption,
    color: colors.stone[600],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  recipeName: {
    ...typography.bodySm,
    fontFamily: 'Inter_600SemiBold',
    color: colors.stone[900],
    marginBottom: 2,
  },
  metaText: { ...typography.caption, color: colors.stone[600] },
  cookedToggle: { paddingLeft: spacing[2] },
  cookedToggleActive: {},
});
