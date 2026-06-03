import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/storage/mmkvStorage';
import { STORAGE_KEYS } from '@/storage/storageKeys';
import type { FamilyProfile, FamilyMember } from '@/types';
import { generateId } from '@/utils/dateUtils';
import { avatarColors } from '@/constants/theme';

interface FamilyState {
  family: FamilyProfile;
  updateFamilyName: (name: string) => void;
  addMember: (member: Omit<FamilyMember, 'id' | 'avatarColor'>) => void;
  updateMember: (id: string, updates: Partial<FamilyMember>) => void;
  removeMember: (id: string) => void;
  setDefaultServings: (servings: number) => void;
}

const defaultFamily: FamilyProfile = {
  id: generateId(),
  familyName: 'My Family',
  members: [],
  defaultServings: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      family: defaultFamily,

      updateFamilyName: (name) =>
        set((state) => ({
          family: { ...state.family, familyName: name, updatedAt: new Date().toISOString() },
        })),

      addMember: (member) => {
        set((state) => {
          const colorIndex = state.family.members.length % avatarColors.length;
          const newMember: FamilyMember = {
            ...member,
            id: generateId(),
            avatarColor: avatarColors[colorIndex],
          };
          return {
            family: {
              ...state.family,
              members: [...state.family.members, newMember],
              updatedAt: new Date().toISOString(),
            },
          };
        });
      },

      updateMember: (id, updates) =>
        set((state) => ({
          family: {
            ...state.family,
            members: state.family.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
            updatedAt: new Date().toISOString(),
          },
        })),

      removeMember: (id) =>
        set((state) => ({
          family: {
            ...state.family,
            members: state.family.members.filter((m) => m.id !== id),
            updatedAt: new Date().toISOString(),
          },
        })),

      setDefaultServings: (servings) =>
        set((state) => ({
          family: { ...state.family, defaultServings: servings, updatedAt: new Date().toISOString() },
        })),
    }),
    {
      name: STORAGE_KEYS.FAMILY,
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);
