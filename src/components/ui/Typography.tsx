import React from 'react';
import { Text, type TextProps, StyleSheet } from 'react-native';
import { colors, typography } from '@/constants/theme';

type Variant = 'display' | 'title' | 'heading' | 'body' | 'bodySm' | 'label' | 'caption' | 'chip';

interface TypographyProps extends TextProps {
  variant?: Variant;
  color?: string;
}

export function Typography({ variant = 'body', color, style, ...props }: TypographyProps) {
  return (
    <Text
      style={[
        typography[variant],
        { color: color ?? colors.stone[900] },
        style,
      ]}
      {...props}
    />
  );
}
