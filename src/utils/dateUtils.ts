import type { DayOfWeek } from '@/types';

const DAY_NAMES: DayOfWeek[] = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
];

export function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/** Returns the Monday of the week containing `date` as YYYY-MM-DD. */
export function getWeekStartDate(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0]!;
}

/** Returns the Date objects for Monday–Sunday of the week starting at weekStartDate. */
export function getWeekDates(weekStartDate: string): Date[] {
  const monday = new Date(weekStartDate + 'T00:00:00');
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function formatDayOfWeek(date: Date): DayOfWeek {
  return DAY_NAMES[date.getDay()]!;
}

export function getDayOfWeekFromIndex(weekStartDate: string, index: number): DayOfWeek {
  const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  return days[index]!;
}

export function formatWeekLabel(weekStartDate: string): string {
  const dates = getWeekDates(weekStartDate);
  const start = dates[0]!;
  const end = dates[6]!;
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${startStr} – ${endStr}`;
}

export function formatDayShort(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2).toUpperCase();
}

export function formatDayNumber(date: Date): string {
  return date.getDate().toString();
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function formatDayHeading(day: DayOfWeek, weekStartDate: string): string {
  const dates = getWeekDates(weekStartDate);
  const dayIndex = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].indexOf(day);
  const date = dates[dayIndex]!;
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

export function getDayLetter(day: DayOfWeek): string {
  return day.charAt(0).toUpperCase();
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}
