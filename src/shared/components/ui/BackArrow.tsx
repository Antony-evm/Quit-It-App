import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import BackArrowSvg from '@/assets/backArrow.svg';
import { AppPressable } from './AppPressable';
import { AppIcon } from './AppIcon';

type BackArrowProps = {
  onPress: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const BackArrow = ({
  onPress,
  disabled = false,
  style,
}: BackArrowProps) => (
  <AppPressable
    onPress={onPress}
    disabled={disabled}
    variant="backArrow"
    disabledOpacity={1}
    style={style}
  >
    <AppIcon icon={BackArrowSvg} variant="backArrow" />
  </AppPressable>
);
