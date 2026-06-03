import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius } from '@/constants/theme';
import { useRecipeStore } from '@/stores/recipeStore';
import { scaleIngredients, formatQuantity } from '@/utils/portionUtils';
import { formatTime } from '@/utils/dateUtils';
import { ChipTag } from '@/components/ui/ChipTag';
import { DIETARY_TAG_LABELS } from '@/constants/dietaryOptions';

export default function RecipeDetailModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const recipe = useRecipeStore((s) => s.getRecipeById(id ?? ''));
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);
  const [servings, setServings] = useState(recipe?.servings ?? 4);

  if (!recipe) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.notFound}>Recipe not found.</Text>
      </SafeAreaView>
    );
  }

  const scaledIngredients = scaleIngredients(recipe.ingredients, recipe.servings, servings);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header controls */}
      <View style={styles.header}>
        <Pressable onPress={router.back} hitSlop={12} style={styles.headerBtn}>
          <Ionicons name="close" size={22} color={colors.stone[900]} />
        </Pressable>
        <Pressable onPress={() => toggleFavorite(recipe.id)} hitSlop={12} style={styles.headerBtn}>
          <Ionicons
            name={recipe.isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={recipe.isFavorite ? colors.danger : colors.stone[900]}
          />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          {recipe.imageUri ? (
            <Image source={{ uri: recipe.imageUri }} style={styles.heroImage} />
          ) : (
            <View style={styles.heroPlaceholder}>
              <Text style={styles.heroEmoji}>🍽️</Text>
            </View>
          )}
        </View>

        {/* Title + Tags */}
        <View style={styles.titleSection}>
          <Text style={styles.recipeName}>{recipe.title}</Text>
          {recipe.description && (
            <Text style={styles.description}>{recipe.description}</Text>
          )}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagsRow}>
            {recipe.tags.map((tag) => (
              <ChipTag key={tag} label={DIETARY_TAG_LABELS[tag]} />
            ))}
          </ScrollView>
        </View>

        {/* Meta row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="timer-outline" size={20} color={colors.primary[400]} />
            <Text style={styles.metaValue}>{formatTime(recipe.prepTimeMinutes)}</Text>
            <Text style={styles.metaLabel}>Prep</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="flame-outline" size={20} color={colors.primary[400]} />
            <Text style={styles.metaValue}>{formatTime(recipe.cookTimeMinutes)}</Text>
            <Text style={styles.metaLabel}>Cook</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={20} color={colors.primary[400]} />
            <View style={styles.servingsStepper}>
              <Pressable hitSlop={8} onPress={() => setServings(Math.max(1, servings - 1))}>
                <Ionicons name="remove" size={16} color={colors.primary[400]} />
              </Pressable>
              <Text style={styles.metaValue}>{servings}</Text>
              <Pressable hitSlop={8} onPress={() => setServings(servings + 1)}>
                <Ionicons name="add" size={16} color={colors.primary[400]} />
              </Pressable>
            </View>
            <Text style={styles.metaLabel}>Servings</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {scaledIngredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <Text style={styles.ingredientQty}>
                {formatQuantity(ingredient.quantity)} {ingredient.unit}
              </Text>
              <Text style={styles.ingredientName}>
                {ingredient.name}{ingredient.notes ? `, ${ingredient.notes}` : ''}
              </Text>
            </View>
          ))}
        </View>

        {/* Steps */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.steps.map((step) => (
            <View key={step.stepNumber} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{step.stepNumber}</Text>
              </View>
              <Text style={styles.stepInstruction}>{step.instruction}</Text>
            </View>
          ))}
        </View>

        {/* Nutrition */}
        {recipe.nutrition && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionTitle}>Nutrition (per serving)</Text>
            <View style={styles.nutritionRow}>
              {[
                { label: 'Calories', value: `${recipe.nutrition.calories}` },
                { label: 'Protein', value: `${recipe.nutrition.proteinG}g` },
                { label: 'Carbs', value: `${recipe.nutrition.carbsG}g` },
                { label: 'Fat', value: `${recipe.nutrition.fatG}g` },
              ].map(({ label, value }) => (
                <View key={label} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{value}</Text>
                  <Text style={styles.nutritionLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  notFound: { ...typography.body, color: colors.stone[600], textAlign: 'center', padding: spacing[8] },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.stone[100],
    borderRadius: radius.full,
  },
  scroll: { paddingBottom: spacing[16] },
  hero: {
    height: 220,
    backgroundColor: colors.primary[100],
    marginHorizontal: spacing[4],
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing[4],
  },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 72 },
  titleSection: { paddingHorizontal: spacing[4], marginBottom: spacing[4] },
  recipeName: { ...typography.display, color: colors.stone[900], marginBottom: spacing[2] },
  description: { ...typography.body, color: colors.stone[600], marginBottom: spacing[3] },
  tagsRow: { gap: spacing[2] },
  metaRow: {
    flexDirection: 'row',
    marginHorizontal: spacing[4],
    backgroundColor: colors.primary[50],
    borderRadius: radius.md,
    padding: spacing[4],
    marginBottom: spacing[6],
  },
  metaItem: { flex: 1, alignItems: 'center', gap: 4 },
  metaDivider: { width: StyleSheet.hairlineWidth, backgroundColor: colors.stone[300] },
  metaValue: { ...typography.heading, color: colors.stone[900] },
  metaLabel: { ...typography.caption, color: colors.stone[600] },
  servingsStepper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sectionBlock: { paddingHorizontal: spacing[4], marginBottom: spacing[6] },
  sectionTitle: { ...typography.heading, color: colors.stone[900], marginBottom: spacing[3] },
  ingredientRow: {
    flexDirection: 'row',
    paddingVertical: spacing[2],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.stone[100],
    gap: spacing[3],
  },
  ingredientQty: {
    ...typography.bodySm,
    fontFamily: 'Inter_600SemiBold',
    color: colors.primary[600],
    width: 80,
  },
  ingredientName: { ...typography.bodySm, color: colors.stone[900], flex: 1 },
  stepRow: {
    flexDirection: 'row',
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary[400],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  stepNumberText: {
    ...typography.label,
    color: colors.white,
  },
  stepInstruction: { ...typography.body, color: colors.stone[900], flex: 1, lineHeight: 24 },
  nutritionRow: {
    flexDirection: 'row',
    backgroundColor: colors.stone[50],
    borderRadius: radius.md,
    padding: spacing[4],
  },
  nutritionItem: { flex: 1, alignItems: 'center' },
  nutritionValue: { ...typography.heading, color: colors.stone[900], fontSize: 16 },
  nutritionLabel: { ...typography.caption, color: colors.stone[600] },
});
