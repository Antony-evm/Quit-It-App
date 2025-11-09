import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import BackArrowSvg from '../../../backArrow.svg';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '../../theme';

type BackArrowProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const BackArrow = ({ onPress, disabled = false }: BackArrowProps) => (
  <Pressable
    style={({ pressed }) => [
      styles.container,
      { opacity: disabled ? 0.7 : pressed ? 1 : 0.7 },
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <BackArrowSvg
      width={20}
      height={20}
      fill={disabled ? BRAND_COLORS.ink : COLOR_PALETTE.backgroundPrimary}
    />
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: BRAND_COLORS.cream,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
