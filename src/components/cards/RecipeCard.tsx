import React from 'react';
import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, shadows, typography, spacing } from '@/constants/theme';
import { formatTime } from '@/utils/dateUtils';
import type { Recipe } from '@/types';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
  onFavoritePress?: () => void;
  width?: number;
}

export function RecipeCard({ recipe, onPress, onFavoritePress, width = 160 }: RecipeCardProps) {
  const totalTime = recipe.prepTimeMinutes + recipe.cookTimeMinutes;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        { width },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.imageContainer, { height: width * 0.6 }]}>
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderEmoji}>🍽️</Text>
          </View>
        )}
        {onFavoritePress && (
          <Pressable onPress={onFavoritePress} hitSlop={8} style={styles.favoriteBtn}>
            <Ionicons
              name={recipe.isFavorite ? 'heart' : 'heart-outline'}
              size={18}
              color={recipe.isFavorite ? colors.danger : colors.white}
            />
          </Pressable>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{recipe.title}</Text>
        <View style={styles.meta}>
          <Ionicons name="time-outline" size={12} color={colors.stone[600]} />
          <Text style={styles.metaText}>{formatTime(totalTime)}</Text>
          {recipe.tags.includes('kid-approved') && (
            <Text style={styles.kidBadge}>👧</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
    ...shadows.md,
  },
  pressed: { transform: [{ scale: 0.97 }] },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: colors.primary[100],
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 40 },
  favoriteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
    padding: 4,
  },
  body: {
    padding: spacing[3],
  },
  title: {
    ...typography.label,
    color: colors.stone[900],
    marginBottom: spacing[1],
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    ...typography.caption,
    color: colors.stone[600],
    marginRight: 4,
  },
  kidBadge: { fontSize: 12 },
});
