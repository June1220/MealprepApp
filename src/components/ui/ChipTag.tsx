import React from 'react';
import { Pressable, Text, StyleSheet, type PressableProps } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface ChipTagProps extends PressableProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function ChipTag({ label, active = false, onPress, ...props }: ChipTagProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={[styles.chip, active && styles.active]}
      {...props}
    >
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.stone[100],
    minHeight: 30,
    justifyContent: 'center',
  },
  active: {
    backgroundColor: colors.primary[400],
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    letterSpacing: 0.3,
    color: colors.stone[600],
  },
  activeLabel: {
    color: colors.white,
  },
});
