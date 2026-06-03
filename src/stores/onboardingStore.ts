import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkvStorage';
import { STORAGE_KEYS } from '@/storage/storageKeys';

interface OnboardingState {
  isComplete: boolean;
  recipesSeeded: boolean;
  completeOnboarding: () => void;
  markRecipesSeeded: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isComplete: false,
      recipesSeeded: false,

      completeOnboarding: () => set({ isComplete: true }),
      markRecipesSeeded: () => set({ recipesSeeded: true }),
    }),
    {
      name: STORAGE_KEYS.ONBOARDING,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
