import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { formatTime } from '@/utils/dateUtils';
import type { Recipe } from '@/types';

interface RecipeRowCardProps {
  recipe: Recipe;
  onPress: () => void;
  rightAction?: React.ReactNode;
}

export function RecipeRowCard({ recipe, onPress, rightAction }: RecipeRowCardProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View style={styles.thumbnail}>
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.thumbnailImage} />
        ) : (
          <Text style={styles.thumbnailEmoji}>🍽️</Text>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={12} color={colors.stone[600]} />
          <Text style={styles.metaText}>{formatTime(totalTime)}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.metaText}>{recipe.servings} servings</Text>
        </View>
      </View>
      {rightAction ?? (
        <Ionicons name="chevron-forward" size={16} color={colors.stone[300]} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[3],
    gap: spacing[3],
    minHeight: 64,
    backgroundColor: colors.white,
    borderRadius: radius.md,
  },
  pressed: { backgroundColor: colors.stone[50] },
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
  title: {
    ...typography.bodySm,
    fontFamily: 'Inter_500Medium',
    color: colors.stone[900],
    marginBottom: 2,
  },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { ...typography.caption, color: colors.stone[600] },
  dot: { ...typography.caption, color: colors.stone[300] },
});
