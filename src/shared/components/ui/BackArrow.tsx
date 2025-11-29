import React from 'react';
import { StyleSheet } from 'react-native';
import BackArrowSvg from '@/assets/backArrow.svg';
import { COLOR_PALETTE } from '@/shared/theme';
import { AppPressable } from './AppPressable';

type BackArrowProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const BackArrow = ({ onPress, disabled = false }: BackArrowProps) => (
  <AppPressable
    style={styles.container}
    onPress={onPress}
    disabled={disabled}
    variant="scale"
  >
    <BackArrowSvg
      width={20}
      height={20}
      fill={
        disabled ? COLOR_PALETTE.textSecondary : COLOR_PALETTE.backgroundPrimary
      }
    />
  </AppPressable>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLOR_PALETTE.backgroundCream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
