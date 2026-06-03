import React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  StyleSheet,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import { colors, radius, typography } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style as ViewStyle,
      ]}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primary[400]} />
      ) : (
        <Text style={[styles.label, styles[`${variant}Label`], styles[`${size}Label`]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    minHeight: 44,
  },
  fullWidth: { width: '100%' },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.45 },

  // Variants
  primary: { backgroundColor: colors.primary[400] },
  secondary: { backgroundColor: colors.primary[100], borderWidth: 0 },
  ghost: { backgroundColor: 'transparent' },
  danger: { backgroundColor: colors.danger },

  // Sizes
  sm: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 36 },
  md: { paddingHorizontal: 24, paddingVertical: 12, minHeight: 48 },
  lg: { paddingHorizontal: 32, paddingVertical: 16, minHeight: 56 },

  // Labels
  label: { fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  primaryLabel: { color: colors.white },
  secondaryLabel: { color: colors.primary[900] },
  ghostLabel: { color: colors.primary[400] },
  dangerLabel: { color: colors.white },

  smLabel: { fontSize: 13 },
  mdLabel: { fontSize: 15 },
  lgLabel: { fontSize: 17 },
});
