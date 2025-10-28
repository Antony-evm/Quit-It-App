import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { COLOR_PALETTE, SPACING } from '../../theme';
import { AppText } from './AppText';

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
    style={[
      styles.tab,
      isSelected && styles.tabSelected,
      disabled && styles.tabDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}>
    <AppText variant="body" tone={isSelected ? 'inverse' : 'primary'}>
      {label}
    </AppText>
  </Pressable>
);

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  tabSelected: {
    backgroundColor: COLOR_PALETTE.accentPrimary,
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  tabDisabled: {
    opacity: 0.5,
  },
});
