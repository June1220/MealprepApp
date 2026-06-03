import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, radius, shadows } from '@/constants/theme';
import { ChipTag } from '@/components/ui/ChipTag';
import { Button } from '@/components/ui/Button';
import { useRecipeStore } from '@/stores/recipeStore';
import { generateId } from '@/utils/dateUtils';
import { DIETARY_TAGS, DIETARY_TAG_LABELS } from '@/constants/dietaryOptions';
import { MEAL_TYPES, MEAL_TYPE_LABELS } from '@/constants/mealTypes';
import type { Ingredient, RecipeStep, MealType, DietaryTag } from '@/types';

export default function AddRecipeModal() {
  const router = useRouter();
  const addRecipe = useRecipeStore((s) => s.addRecipe);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMealTypes, setSelectedMealTypes] = useState<MealType[]>([]);
  const [selectedTags, setSelectedTags] = useState<DietaryTag[]>([]);
  const [prepTime, setPrepTime] = useState('10');
  const [cookTime, setCookTime] = useState('20');
  const [servings, setServings] = useState('4');
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: generateId(), name: '', quantity: 1, unit: 'cup' },
  ]);
  const [steps, setSteps] = useState<RecipeStep[]>([
    { stepNumber: 1, instruction: '' },
  ]);

  const toggleMealType = (mt: MealType) => {
    setSelectedMealTypes((prev) =>
      prev.includes(mt) ? prev.filter((x) => x !== mt) : [...prev, mt]
    );
  };

  const toggleTag = (tag: DietaryTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((x) => x !== tag) : [...prev, tag]
    );
  };

  const addIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { id: generateId(), name: '', quantity: 1, unit: 'cup' },
    ]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients((prev) =>
      prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  const removeIngredient = (id: string) => {
    if (ingredients.length <= 1) return;
    setIngredients((prev) => prev.filter((i) => i.id !== id));
  };

  const addStep = () => {
    setSteps((prev) => [
      ...prev,
      { stepNumber: prev.length + 1, instruction: '' },
    ]);
  };

  const updateStep = (index: number, instruction: string) => {
    setSteps((prev) =>
      prev.map((step, i) => (i === index ? { ...step, instruction } : step))
    );
  };

  const removeStep = (index: number) => {
    if (steps.length <= 1) return;
    setSteps((prev) =>
      prev.filter((_, i) => i !== index).map((step, i) => ({ ...step, stepNumber: i + 1 }))
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Recipe name required', 'Please enter a name for your recipe.');
      return;
    }
    const validIngredients = ingredients.filter((i) => i.name.trim());
    const validSteps = steps.filter((s) => s.instruction.trim());

    addRecipe({
      id: generateId(),
      title: title.trim(),
      description: description.trim() || undefined,
      mealTypes: selectedMealTypes.length > 0 ? selectedMealTypes : ['dinner'],
      tags: selectedTags,
      prepTimeMinutes: parseInt(prepTime) || 10,
      cookTimeMinutes: parseInt(cookTime) || 20,
      servings: parseInt(servings) || 4,
      ingredients: validIngredients.length > 0 ? validIngredients : ingredients,
      steps: validSteps.length > 0 ? validSteps : steps,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      source: 'manual',
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={router.back} hitSlop={12}>
          <Ionicons name="close" size={22} color={colors.stone[900]} />
        </Pressable>
        <Text style={styles.headerTitle}>New Recipe</Text>
        <Pressable onPress={handleSave} hitSlop={8}>
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Title */}
        <TextInput
          style={styles.titleInput}
          placeholder="Recipe name"
          placeholderTextColor={colors.stone[300]}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.descInput}
          placeholder="Short description (optional)"
          placeholderTextColor={colors.stone[300]}
          value={description}
          onChangeText={setDescription}
          multiline
        />

        {/* Meal Types */}
        <Text style={styles.fieldLabel}>Meal Type</Text>
        <View style={styles.chipRow}>
          {MEAL_TYPES.map((mt) => (
            <ChipTag
              key={mt}
              label={MEAL_TYPE_LABELS[mt]}
              active={selectedMealTypes.includes(mt)}
              onPress={() => toggleMealType(mt)}
            />
          ))}
        </View>

        {/* Dietary Tags */}
        <Text style={styles.fieldLabel}>Dietary Tags</Text>
        <View style={styles.chipRow}>
          {DIETARY_TAGS.map((tag) => (
            <ChipTag
              key={tag}
              label={DIETARY_TAG_LABELS[tag]}
              active={selectedTags.includes(tag)}
              onPress={() => toggleTag(tag)}
            />
          ))}
        </View>

        {/* Times & Servings */}
        <View style={styles.timesRow}>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Prep (min)</Text>
            <TextInput
              style={styles.timeInput}
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Cook (min)</Text>
            <TextInput
              style={styles.timeInput}
              value={cookTime}
              onChangeText={setCookTime}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.timeField}>
            <Text style={styles.fieldLabel}>Servings</Text>
            <TextInput
              style={styles.timeInput}
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.fieldLabel}>Ingredients</Text>
        {ingredients.map((ing) => (
          <View key={ing.id} style={styles.ingredientRow}>
            <TextInput
              style={[styles.ingInput, styles.ingQty]}
              placeholder="Qty"
              placeholderTextColor={colors.stone[300]}
              value={ing.quantity.toString()}
              onChangeText={(v) => updateIngredient(ing.id, 'quantity', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.ingInput, styles.ingUnit]}
              placeholder="Unit"
              placeholderTextColor={colors.stone[300]}
              value={ing.unit}
              onChangeText={(v) => updateIngredient(ing.id, 'unit', v)}
            />
            <TextInput
              style={[styles.ingInput, styles.ingName]}
              placeholder="Ingredient name"
              placeholderTextColor={colors.stone[300]}
              value={ing.name}
              onChangeText={(v) => updateIngredient(ing.id, 'name', v)}
            />
            <Pressable onPress={() => removeIngredient(ing.id)} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.stone[300]} />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addRowBtn} onPress={addIngredient}>
          <Ionicons name="add" size={16} color={colors.primary[400]} />
          <Text style={styles.addRowLabel}>Add Ingredient</Text>
        </Pressable>

        {/* Steps */}
        <Text style={[styles.fieldLabel, { marginTop: spacing[4] }]}>Instructions</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>{step.stepNumber}</Text>
            </View>
            <TextInput
              style={styles.stepInput}
              placeholder={`Step ${step.stepNumber}`}
              placeholderTextColor={colors.stone[300]}
              value={step.instruction}
              onChangeText={(v) => updateStep(index, v)}
              multiline
            />
            <Pressable onPress={() => removeStep(index)} hitSlop={8}>
              <Ionicons name="close" size={18} color={colors.stone[300]} />
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.addRowBtn} onPress={addStep}>
          <Ionicons name="add" size={16} color={colors.primary[400]} />
          <Text style={styles.addRowLabel}>Add Step</Text>
        </Pressable>

        <Button
          label="Save Recipe"
          onPress={handleSave}
          fullWidth
          style={styles.saveBtn}
          size="lg"
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.stone[100],
  },
  headerTitle: { ...typography.heading, color: colors.stone[900] },
  saveText: { ...typography.label, color: colors.primary[400], fontSize: 15 },
  form: { padding: spacing[4], paddingBottom: spacing[16] },
  titleInput: {
    ...typography.title,
    color: colors.stone[900],
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[200],
    paddingVertical: spacing[3],
    marginBottom: spacing[3],
    minHeight: 52,
  },
  descInput: {
    ...typography.body,
    color: colors.stone[900],
    borderBottomWidth: 1,
    borderBottomColor: colors.stone[100],
    paddingVertical: spacing[2],
    marginBottom: spacing[4],
    minHeight: 44,
  },
  fieldLabel: {
    ...typography.label,
    color: colors.stone[600],
    marginBottom: spacing[2],
    marginTop: spacing[2],
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2], marginBottom: spacing[4] },
  timesRow: { flexDirection: 'row', gap: spacing[3], marginBottom: spacing[4] },
  timeField: { flex: 1 },
  timeInput: {
    backgroundColor: colors.stone[100],
    borderRadius: radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    ...typography.body,
    color: colors.stone[900],
    textAlign: 'center',
    minHeight: 44,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[2],
  },
  ingInput: {
    backgroundColor: colors.stone[100],
    borderRadius: radius.sm,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[2],
    ...typography.bodySm,
    color: colors.stone[900],
    minHeight: 44,
  },
  ingQty: { width: 50, textAlign: 'center' },
  ingUnit: { width: 60 },
  ingName: { flex: 1 },
  addRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    marginBottom: spacing[2],
    minHeight: 44,
  },
  addRowLabel: { ...typography.label, color: colors.primary[400] },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing[3],
    marginBottom: spacing[3],
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: colors.primary[400],
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 8,
  },
  stepNumText: { ...typography.label, color: colors.white },
  stepInput: {
    flex: 1,
    backgroundColor: colors.stone[100],
    borderRadius: radius.sm,
    padding: spacing[3],
    ...typography.body,
    color: colors.stone[900],
    minHeight: 52,
    textAlignVertical: 'top',
  },
  saveBtn: { marginTop: spacing[8] },
});
