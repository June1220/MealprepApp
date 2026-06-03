import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@/constants/theme';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  primaryAction?: { label: string; onPress: () => void };
  secondaryAction?: { label: string; onPress: () => void };
  emoji?: string;
}

export function EmptyState({ title, description, primaryAction, secondaryAction, emoji = '🥘' }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[typography.heading, styles.title]}>{title}</Text>
      <Text style={[typography.body, styles.description]}>{description}</Text>
      {primaryAction && (
        <Button label={primaryAction.label} onPress={primaryAction.onPress} style={styles.button} />
      )}
      {secondaryAction && (
        <Button
          label={secondaryAction.label}
          onPress={secondaryAction.onPress}
          variant="ghost"
          style={styles.secondaryButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[8],
    paddingVertical: spacing[12],
  },
  emoji: {
    fontSize: 64,
    marginBottom: spacing[4],
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing[2],
    color: colors.stone[900],
  },
  description: {
    textAlign: 'center',
    color: colors.stone[600],
    marginBottom: spacing[8],
  },
  button: {
    minWidth: 200,
  },
  secondaryButton: {
    marginTop: spacing[2],
  },
});
