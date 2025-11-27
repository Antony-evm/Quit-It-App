import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import {
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
  BRAND_COLORS,
} from '@/shared/theme';
import { AppText } from '@/shared/components/ui';

type AnswerTabVariant =
  | 'timeslot'
  | 'multiple-many'
  | 'multiple-few'
  | 'default';

type AnswerTabProps = {
  label: string;
  isSelected?: boolean;
  disabled?: boolean;
  variant?: AnswerTabVariant;
  onPress: () => void;
};

export const AnswerTab = ({
  label,
  isSelected = false,
  disabled = false,
  variant = 'default',
  onPress,
}: AnswerTabProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'timeslot':
        return styles.timeslotTab;
      case 'multiple-many':
        return styles.multipleManyTab;
      case 'multiple-few':
        return styles.multipleFewTab;
      default:
        return {};
    }
  };

  const getBaseStyles = () => {
    // Use different base styles for multiple-few to avoid flex conflicts
    if (variant === 'multiple-few') {
      return styles.multipleFewBase;
    }
    return styles.tab;
  };

  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: isSelected, disabled }}
      style={({ pressed }) => [
        getBaseStyles(),
        getVariantStyles(),
        isSelected && styles.tabSelected,
        disabled && styles.tabDisabled,
        pressed && !disabled && styles.tabPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText
        variant="body"
        tone={isSelected ? 'inverse' : 'primary'}
        style={[
          isSelected && { color: COLOR_PALETTE.backgroundMuted },
          !isSelected && { color: COLOR_PALETTE.backgroundCream },
          variant === 'multiple-many' && styles.multipleManyText,
        ]}
      >
        {label}
      </AppText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tab: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    flexGrow: 1,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  multipleFewBase: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xl,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  timeslotTab: {
    borderRadius: BORDER_RADIUS.small,
    minHeight: 20,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.xs,
    flexBasis: '20%',
  },
  multipleManyTab: {
    borderRadius: BORDER_RADIUS.medium,
    minHeight: 70,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    flexBasis: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BRAND_COLORS.dark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 10,
  },
  multipleFewTab: {
    borderRadius: BORDER_RADIUS.xlarge,
    marginBottom: SPACING.sm,
  },
  multipleManyText: {
    textAlign: 'center',
  },
  tabSelected: {
    backgroundColor: COLOR_PALETTE.backgroundCream,
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  tabDisabled: {
    opacity: 0.5,
  },
  tabPressed: {
    opacity: 0.9,
  },
});
