import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, radius } from '@/constants/theme';

interface AvatarProps {
  name: string;
  color?: string;
  imageUri?: string;
  size?: number;
}

export function Avatar({ name, color, imageUri, size = 40 }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const bgColor = color ?? colors.primary[400];

  if (imageUri) {
    return (
      <Image
        source={{ uri: imageUri }}
        style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bgColor },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.white,
  },
});
