import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkvStorage';
import { STORAGE_KEYS } from '@/storage/storageKeys';
import type { Recipe } from '@/types';

interface RecipeState {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  seedRecipes: (recipes: Recipe[]) => void;
  getRecipeById: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>()(
  persist(
    (set, get) => ({
      recipes: [],

      addRecipe: (recipe) =>
        set((state) => ({ recipes: [...state.recipes, recipe] })),

      updateRecipe: (id, updates) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
          ),
        })),

      deleteRecipe: (id) =>
        set((state) => ({ recipes: state.recipes.filter((r) => r.id !== id) })),

      toggleFavorite: (id) =>
        set((state) => ({
          recipes: state.recipes.map((r) =>
            r.id === id ? { ...r, isFavorite: !r.isFavorite, updatedAt: new Date().toISOString() } : r
          ),
        })),

      seedRecipes: (recipes) =>
        set((state) => {
          const existingIds = new Set(state.recipes.map((r) => r.id));
          const newRecipes = recipes.filter((r) => !existingIds.has(r.id));
          return { recipes: [...state.recipes, ...newRecipes] };
        }),

      getRecipeById: (id) => get().recipes.find((r) => r.id === id),
    }),
    {
      name: STORAGE_KEYS.RECIPES,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
