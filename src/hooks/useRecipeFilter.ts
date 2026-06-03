import { useMemo, useState } from 'react';
import { useRecipeStore } from '@/stores/recipeStore';
import type { MealType, DietaryTag } from '@/types';

export type RecipeFilter = MealType | 'all' | 'favorites' | 'quick';

export function useRecipeFilter() {
  const recipes = useRecipeStore((s) => s.recipes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<RecipeFilter>('all');

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.tags.some((t) => t.includes(q)) ||
          r.ingredients.some((i) => i.name.toLowerCase().includes(q))
      );
    }

    switch (activeFilter) {
      case 'favorites':
        result = result.filter((r) => r.isFavorite);
        break;
      case 'quick':
        result = result.filter((r) => r.prepTimeMinutes + r.cookTimeMinutes <= 30);
        break;
      case 'all':
        break;
      default:
        result = result.filter((r) => r.mealTypes.includes(activeFilter));
    }

    return result;
  }, [recipes, searchQuery, activeFilter]);

  return {
    filteredRecipes,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
  };
}
