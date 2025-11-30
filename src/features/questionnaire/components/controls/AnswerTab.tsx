import React from 'react';
import { StyleSheet } from 'react-native';

import { COLOR_PALETTE } from '@/shared/theme';
import { AppText, AppPressable } from '@/shared/components/ui';

export const ANSWER_TAB_VARIANTS = {
  DEFAULT: 'default',
  MULTIPLE_MANY: 'multiple-many',
} as const;

export type AnswerTabVariantType =
  (typeof ANSWER_TAB_VARIANTS)[keyof typeof ANSWER_TAB_VARIANTS];

type AnswerTabProps = {
  label: string;
  isSelected?: boolean;
  disabled?: boolean;
  variant?: AnswerTabVariantType;
  onPress: () => void;
};

export const AnswerTab = ({
  label,
  isSelected = false,
  disabled = false,
  variant = ANSWER_TAB_VARIANTS.DEFAULT,
  onPress,
}: AnswerTabProps) => {
  const pressableVariant =
    variant === ANSWER_TAB_VARIANTS.MULTIPLE_MANY ? 'answerGrid' : 'answer';

  return (
    <AppPressable
      variant={pressableVariant}
      selected={isSelected}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <AppText
        variant="body"
        tone={isSelected ? 'inverse' : 'primary'}
        style={[
          isSelected && { color: COLOR_PALETTE.backgroundMuted },
          !isSelected && { color: COLOR_PALETTE.backgroundCream },
          variant === ANSWER_TAB_VARIANTS.MULTIPLE_MANY &&
            styles.multipleManyText,
        ]}
      >
        {label}
      </AppText>
    </AppPressable>
  );
};

const styles = StyleSheet.create({
  multipleManyText: {
    textAlign: 'center',
  },
});
