import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export const mmkvStorage: StateStorage = {
  getItem: async (key) => {
    return AsyncStorage.getItem(key);
  },
  setItem: async (key, value) => {
    AsyncStorage.setItem(key, value);
  },
  removeItem: async (key) => {
    AsyncStorage.removeItem(key);
  },
};
