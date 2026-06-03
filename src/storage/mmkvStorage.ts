import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

export const storage = new MMKV();

export const mmkvStorage: StateStorage = {
  getItem: (key) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  setItem: (key, value) => {
    storage.set(key, value);
  },
  removeItem: (key) => {
    storage.delete(key);
  },
};
