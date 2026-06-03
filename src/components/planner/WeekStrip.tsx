import React from 'react';
import { View, ScrollView, Pressable, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { getWeekDates, formatDayShort, formatDayNumber, isToday, getDayOfWeekFromIndex } from '@/utils/dateUtils';
import type { DayOfWeek, MealType } from '@/types';

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner'];

interface WeekStripProps {
  weekStartDate: string;
  activeDay: DayOfWeek;
  onDayPress: (day: DayOfWeek) => void;
  getDayCompletion: (day: DayOfWeek) => { filled: number; total: number };
}

export function WeekStrip({ weekStartDate, activeDay, onDayPress, getDayCompletion }: WeekStripProps) {
  const weekDates = getWeekDates(weekStartDate);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {weekDates.map((date, index) => {
        const day = getDayOfWeekFromIndex(weekStartDate, index);
        const isActive = day === activeDay;
        const todayHighlight = isToday(date);
        const { filled, total } = getDayCompletion(day);

        return (
          <Pressable
            key={day}
            onPress={() => onDayPress(day)}
            style={[styles.dayButton, isActive && styles.dayButtonActive]}
          >
            <Text style={[styles.dayLabel, isActive && styles.dayLabelActive]}>
              {formatDayShort(date)}
            </Text>
            <Text
              style={[
                styles.dayNumber,
                isActive && styles.dayNumberActive,
                todayHighlight && !isActive && styles.todayHighlight,
              ]}
            >
              {formatDayNumber(date)}
            </Text>
            <View style={styles.pips}>
              {MEAL_TYPES.map((mt, i) => {
                const isFilled = i < filled;
                return (
                  <View
                    key={mt}
                    style={[
                      styles.pip,
                      isFilled
                        ? (isActive ? styles.pipFilledActive : styles.pipFilled)
                        : (isActive ? styles.pipEmptyActive : styles.pipEmpty),
                    ]}
                  />
                );
              })}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing[4],
    gap: spacing[2],
  },
  dayButton: {
    width: 44,
    alignItems: 'center',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[1],
    borderRadius: radius.md,
  },
  dayButtonActive: {
    backgroundColor: colors.primary[400],
  },
  dayLabel: {
    ...typography.caption,
    color: colors.stone[600],
    marginBottom: 2,
  },
  dayLabelActive: { color: colors.white },
  dayNumber: {
    ...typography.label,
    color: colors.stone[900],
    marginBottom: spacing[1],
  },
  dayNumberActive: { color: colors.white },
  todayHighlight: {
    color: colors.primary[400],
    fontFamily: 'Inter_700Bold',
  },
  pips: {
    flexDirection: 'row',
    gap: 3,
  },
  pip: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  pipFilled: { backgroundColor: colors.primary[400] },
  pipFilledActive: { backgroundColor: colors.white },
  pipEmpty: { backgroundColor: colors.stone[300] },
  pipEmptyActive: { backgroundColor: 'rgba(255,255,255,0.4)' },
});
