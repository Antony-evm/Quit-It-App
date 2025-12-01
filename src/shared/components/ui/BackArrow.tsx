import React from 'react';
import BackArrowSvg from '@/assets/backArrow.svg';
import { AppPressable } from './AppPressable';
import { AppIcon } from './AppIcon';

type BackArrowProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const BackArrow = ({ onPress, disabled = false }: BackArrowProps) => (
  <AppPressable
    onPress={onPress}
    disabled={disabled}
    variant="backArrow"
    disabledOpacity={1}
  >
    <AppIcon icon={BackArrowSvg} variant="backArrow" />
  </AppPressable>
);
