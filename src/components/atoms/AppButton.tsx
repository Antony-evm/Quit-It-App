import React from 'react';
import { Pressable, PressableProps, StyleSheet, ViewStyle } from 'react-native';

import { AppText } from './AppText';
import { COLOR_PALETTE, SPACING } from '../../theme';

type ButtonTone = 'primary' | 'secondary';

export type AppButtonProps = PressableProps & {
  label: string;
  tone?: ButtonTone;
  containerStyle?: ViewStyle;
};

const toneToStyles: Record<
  ButtonTone,
  { container: ViewStyle; labelTone: 'primary' | 'inverse' }
> = {
  primary: {
    container: {
      backgroundColor: COLOR_PALETTE.accentPrimary,
    },
    labelTone: 'inverse',
  },
  secondary: {
    container: {
      backgroundColor: COLOR_PALETTE.accentMuted,
    },
    labelTone: 'primary',
  },
};

export const AppButton = ({
  label,
  tone = 'primary',
  containerStyle,
  ...pressableProps
}: AppButtonProps) => {
  const toneStyles = toneToStyles[tone] ?? toneToStyles.primary;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.base,
        toneStyles.container,
        pressed && styles.pressed,
        containerStyle,
      ]}
      {...pressableProps}>
      <AppText variant="heading" tone={toneStyles.labelTone}>
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});
