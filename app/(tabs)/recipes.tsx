import React from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Pressable, FlatList, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { colors, spacing, typography, radius, shadows } from '@/constants/theme';
import { RecipeCard } from '@/components/cards/RecipeCard';
import { RecipeRowCard } from '@/components/cards/RecipeRowCard';
import { ChipTag } from '@/components/ui/ChipTag';
import { EmptyState } from '@/components/ui/EmptyState';
import { useRecipeFilter, type RecipeFilter } from '@/hooks/useRecipeFilter';
import { useRecipeStore } from '@/stores/recipeStore';
import { sampleRecipes } from '@/seeds/sampleRecipes';

const FILTERS: { key: RecipeFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'quick', label: '⚡ Quick' },
  { key: 'favorites', label: '♥ Favorites' },
];

export default function RecipesScreen() {
  const router = useRouter();
  const { filteredRecipes, searchQuery, setSearchQuery, activeFilter, setActiveFilter } = useRecipeFilter();
  const toggleFavorite = useRecipeStore((s) => s.toggleFavorite);
  const seedRecipes = useRecipeStore((s) => s.seedRecipes);
  const [isGridView, setIsGridView] = React.useState(true);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Recipes</Text>
        <Pressable
          onPress={() => setIsGridView(!isGridView)}
          hitSlop={8}
          style={styles.viewToggle}
        >
          <Ionicons
            name={isGridView ? 'list-outline' : 'grid-outline'}
            size={22}
            color={colors.stone[600]}
          />
        </Pressable>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={18} color={colors.stone[300]} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes, ingredients..."
          placeholderTextColor={colors.stone[300]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color={colors.stone[300]} />
          </Pressable>
        )}
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterRow}
      >
        {FILTERS.map((f) => (
          <ChipTag
            key={f.key}
            label={f.label}
            active={activeFilter === f.key}
            onPress={() => setActiveFilter(f.key)}
          />
        ))}
      </ScrollView>

      {/* Recipe list */}
      {filteredRecipes.length === 0 ? (
        <EmptyState
          emoji="📖"
          title="No recipes yet"
          description="Add your family's favourite meals to get started."
          primaryAction={{
            label: 'Add a Recipe',
            onPress: () => router.push('/(modal)/add-recipe'),
          }}
          secondaryAction={{
            label: 'Load starter recipes',
            onPress: () => seedRecipes(sampleRecipes),
          }}
        />
      ) : isGridView ? (
        <FlashList
          data={filteredRecipes}
          numColumns={2}
          estimatedItemSize={220}
          contentContainerStyle={styles.gridContent}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
              <RecipeCard
                recipe={item}
                width={undefined as any}
                onPress={() => router.push({ pathname: '/(modal)/recipe-detail', params: { id: item.id } })}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            </View>
          )}
        />
      ) : (
        <FlashList
          data={filteredRecipes}
          estimatedItemSize={76}
          contentContainerStyle={styles.listContent}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={{ height: spacing[2] }} />}
          renderItem={({ item }) => (
            <RecipeRowCard
              recipe={item}
              onPress={() => router.push({ pathname: '/(modal)/recipe-detail', params: { id: item.id } })}
            />
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/(modal)/add-recipe')}
      >
        <Ionicons name="add" size={28} color={colors.white} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.stone[50] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[3],
  },
  title: {
    ...typography.display,
    color: colors.stone[900],
    fontSize: 24,
  },
  viewToggle: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing[4],
    marginBottom: spacing[3],
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing[3],
    minHeight: 44,
    ...shadows.sm,
  },
  searchIcon: { marginRight: spacing[2] },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.stone[900],
    paddingVertical: spacing[3],
  },
  filterRow: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[3],
    gap: spacing[2],
  },
  gridContent: {
    padding: spacing[2],
  },
  gridItem: {
    flex: 1,
    padding: spacing[2],
  },
  gridItemLeft: { paddingLeft: spacing[3] },
  gridItemRight: { paddingRight: spacing[3] },
  listContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[16],
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary[400],
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  fabPressed: { transform: [{ scale: 0.94 }] },
});
