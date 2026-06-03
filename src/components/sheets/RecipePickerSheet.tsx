import React, { useCallback, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import BottomSheet, { BottomSheetFlatList, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { colors, radius, spacing, typography, shadows } from '@/constants/theme';
import { ChipTag } from '@/components/ui/ChipTag';
import { RecipeRowCard } from '@/components/cards/RecipeRowCard';
import { useRecipeStore } from '@/stores/recipeStore';
import { useRecipeFilter, type RecipeFilter } from '@/hooks/useRecipeFilter';
import type { Recipe, MealType } from '@/types';

const FILTERS: { key: RecipeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'quick', label: '⚡ Quick' },
  { key: 'favorites', label: '♥ Favorites' },
];

interface RecipePickerSheetProps {
  sheetRef: React.RefObject<BottomSheet>;
  onSelect: (recipe: Recipe) => void;
  preferredMealType?: MealType;
}

export function RecipePickerSheet({ sheetRef, onSelect, preferredMealType }: RecipePickerSheetProps) {
  const { filteredRecipes, searchQuery, setSearchQuery, activeFilter, setActiveFilter } = useRecipeFilter();
  const snapPoints = useMemo(() => ['60%', '90%'], []);

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Choose a Recipe</Text>
        <BottomSheetTextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          placeholderTextColor={colors.stone[300]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={FILTERS}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.filterRow}
          renderItem={({ item }) => (
            <ChipTag
              label={item.label}
              active={activeFilter === item.key}
              onPress={() => setActiveFilter(item.key)}
            />
          )}
        />
      </View>
      <BottomSheetFlatList
        data={filteredRecipes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <RecipeRowCard
            recipe={item}
            onPress={() => {
              sheetRef.current?.close();
              onSelect(item);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No recipes found</Text>
          </View>
        }
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    ...shadows.lg,
  },
  handle: {
    backgroundColor: colors.stone[300],
    width: 36,
    height: 4,
  },
  header: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[2],
  },
  title: {
    ...typography.heading,
    color: colors.stone[900],
    marginBottom: spacing[3],
  },
  searchInput: {
    backgroundColor: colors.stone[100],
    borderRadius: radius.sm,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[3],
    ...typography.body,
    color: colors.stone[900],
    marginBottom: spacing[3],
    minHeight: 44,
  },
  filterRow: {
    gap: spacing[2],
    paddingBottom: spacing[2],
  },
  list: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[8],
  },
  separator: {
    height: spacing[2],
  },
  empty: {
    padding: spacing[8],
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.stone[600],
  },
});
