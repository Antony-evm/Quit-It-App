import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { AppSurface, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

type QuestionOptionCardProps = {
  label: string;
  description?: string;
  isSelected?: boolean;
  onPress: () => void;
};

export const QuestionOptionCard = ({
  label,
  description,
  isSelected = false,
  onPress,
}: QuestionOptionCardProps) => (
  <Pressable onPress={onPress} style={styles.touchable}>
    <AppSurface
      style={[
        styles.surface,
        isSelected && { borderColor: COLOR_PALETTE.accentPrimary },
      ]}
    >
      <AppText variant="heading">{label}</AppText>
      {description ? (
        <AppText variant="body" tone="secondary" style={styles.description}>
          {description}
        </AppText>
      ) : null}
    </AppSurface>
  </Pressable>
);

const styles = StyleSheet.create({
  touchable: {
    width: '100%',
  },
  surface: {
    gap: SPACING.xs,
    paddingHorizontal: 0,
  },
  description: {
    marginTop: SPACING.xs,
  },
});
