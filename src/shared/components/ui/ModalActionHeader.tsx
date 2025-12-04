import React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';

import CancelIcon from '@/assets/cancel.svg';
import { AppIcon } from './AppIcon';
import { AppPressable } from './AppPressable';
import { AppText } from './AppText';
import { Box } from './Box';
import { TEXT } from '../../theme';

type ModalActionHeaderProps = {
  onClose: () => void;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
  primaryIcon?: React.FC<SvgProps>;
  title?: string;
  style?: StyleProp<ViewStyle>;
};

export const ModalActionHeader = ({
  onClose,
  onPrimaryAction,
  primaryLabel,
  primaryIcon,
  title,
  style,
}: ModalActionHeaderProps) => {
  const showPrimaryAction = Boolean(
    onPrimaryAction && (primaryLabel || primaryIcon),
  );

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      style={[styles.container, style]}
    >
      <AppPressable onPress={onClose} variant="icon" hitSlop={10}>
        <AppIcon icon={CancelIcon} />
      </AppPressable>

      {title && (
        <Box style={styles.titleContainer}>
          <AppText variant="heading">{title}</AppText>
        </Box>
      )}

      {showPrimaryAction ? (
        <AppPressable onPress={onPrimaryAction} variant="icon" hitSlop={10}>
          {primaryIcon ? (
            <AppIcon icon={primaryIcon} />
          ) : (
            <AppText style={styles.primaryLabel}>{primaryLabel}</AppText>
          )}
        </AppPressable>
      ) : (
        <Box style={styles.spacer} />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {},
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  primaryLabel: {
    color: TEXT.primary,
    fontWeight: '600',
  },
  spacer: {
    width: 24,
  },
});
