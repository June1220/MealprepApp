import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, spacing, typography, shadows } from '@/constants/theme';

interface MealOption {
  label: string;
  icon: string;
  onPress: () => void;
  danger?: boolean;
}

interface MealOptionsSheetProps {
  sheetRef: React.RefObject<BottomSheet | null>;
  recipeName?: string;
  isCooked?: boolean;
  onViewRecipe: () => void;
  onReplace: () => void;
  onToggleCooked: () => void;
  onRemove: () => void;
}

export function MealOptionsSheet({
  sheetRef,
  recipeName,
  isCooked,
  onViewRecipe,
  onReplace,
  onToggleCooked,
  onRemove,
}: MealOptionsSheetProps) {
  const snapPoints = useMemo(() => ['35%'], []);

  const options: MealOption[] = [
    { label: 'View Recipe', icon: 'book-outline', onPress: onViewRecipe },
    { label: 'Replace Meal', icon: 'swap-horizontal-outline', onPress: onReplace },
    {
      label: isCooked ? 'Mark as Uncooked' : 'Mark as Cooked',
      icon: isCooked ? 'close-circle-outline' : 'checkmark-circle-outline',
      onPress: onToggleCooked,
    },
    { label: 'Remove from Plan', icon: 'trash-outline', onPress: onRemove, danger: true },
  ];

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.sheet}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetView style={styles.container}>
        {recipeName && (
          <Text style={styles.recipeName} numberOfLines={1}>{recipeName}</Text>
        )}
        {options.map((option) => (
          <Pressable
            key={option.label}
            style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
            onPress={() => {
              sheetRef.current?.close();
              option.onPress();
            }}
          >
            <Ionicons
              name={option.icon as any}
              size={20}
              color={option.danger ? colors.danger : colors.stone[900]}
            />
            <Text style={[styles.optionLabel, option.danger && styles.dangerLabel]}>
              {option.label}
            </Text>
          </Pressable>
        ))}
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    ...shadows.lg,
  },
  handle: {
    backgroundColor: colors.stone[300],
    width: 36,
    height: 4,
  },
  container: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[6],
  },
  recipeName: {
    ...typography.label,
    color: colors.stone[600],
    marginBottom: spacing[3],
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing[4],
    gap: spacing[3],
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.stone[100],
    minHeight: 52,
  },
  optionPressed: { backgroundColor: colors.stone[50] },
  optionLabel: {
    ...typography.body,
    color: colors.stone[900],
  },
  dangerLabel: { color: colors.danger },
});
