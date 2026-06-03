import { create } from 'zustand';
import { getWeekStartDate, formatDayOfWeek } from '@/utils/dateUtils';
import type { DayOfWeek } from '@/types';

interface UIState {
  activeDay: DayOfWeek;
  activeWeekStartDate: string;
  setActiveDay: (day: DayOfWeek) => void;
  setActiveWeek: (weekStartDate: string) => void;
  goToPreviousWeek: () => void;
  goToNextWeek: () => void;
  resetToCurrentWeek: () => void;
}

const today = new Date();

export const useUIStore = create<UIState>((set, get) => ({
  activeDay: formatDayOfWeek(today),
  activeWeekStartDate: getWeekStartDate(today),

  setActiveDay: (day) => set({ activeDay: day }),
  setActiveWeek: (weekStartDate) => set({ activeWeekStartDate: weekStartDate }),

  goToPreviousWeek: () => {
    const current = new Date(get().activeWeekStartDate);
    current.setDate(current.getDate() - 7);
    set({ activeWeekStartDate: getWeekStartDate(current) });
  },

  goToNextWeek: () => {
    const current = new Date(get().activeWeekStartDate);
    current.setDate(current.getDate() + 7);
    set({ activeWeekStartDate: getWeekStartDate(current) });
  },

  resetToCurrentWeek: () => {
    const now = new Date();
    set({
      activeDay: formatDayOfWeek(now),
      activeWeekStartDate: getWeekStartDate(now),
    });
  },
}));
