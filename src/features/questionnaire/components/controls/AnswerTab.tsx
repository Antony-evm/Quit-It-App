import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { COLOR_PALETTE, SPACING } from '../../../../shared/theme';
import { AppText } from '../../../../shared/components/ui';

type AnswerTabProps = {
  label: string;
  isSelected?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const AnswerTab = ({
  label,
  isSelected = false,
  disabled = false,
  onPress,
}: AnswerTabProps) => (
  <Pressable
    accessibilityRole="tab"
    accessibilityState={{ selected: isSelected, disabled }}
    style={({ pressed }) => [
      styles.tab,
      isSelected && styles.tabSelected,
      disabled && styles.tabDisabled,
      pressed && !disabled && styles.tabPressed,
    ]}
    onPress={onPress}
    disabled={disabled}>
    <AppText
      variant="body"
      tone={isSelected ? 'primary' : 'secondary'}
      style={styles.tabLabel}>
      {label}
    </AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    flexBasis: '48%',
    flexGrow: 1,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabSelected: {
    backgroundColor: COLOR_PALETTE.accentMuted,
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  tabLabel: {
    textAlign: 'center',
    letterSpacing: 0.4,
    fontSize: 16,
  },
});
