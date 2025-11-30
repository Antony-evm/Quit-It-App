import React from 'react';
import { StyleSheet } from 'react-native';

import { AppCard, AppText, AppPressable } from '@/shared/components/ui';
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
  <AppPressable onPress={onPress} fullWidth>
    <AppCard
      p="zero"
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
    </AppCard>
  </AppPressable>
);

const styles = StyleSheet.create({
  surface: {
    gap: SPACING.xs,
  },
  description: {
    marginTop: SPACING.xs,
  },
});
