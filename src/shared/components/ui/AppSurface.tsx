import React, { PropsWithChildren } from 'react';
import { StyleSheet, ViewProps } from 'react-native';

import { Box, BoxProps } from './Box';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '../../theme';

export type AppSurfaceProps = PropsWithChildren<ViewProps>;

export const AppSurface = ({
  style,
  children,
  ...viewProps
}: AppSurfaceProps) => (
  <Box
    bg="backgroundPrimary"
    borderRadius="large"
    p="xl"
    style={[styles.surface, style]}
    {...viewProps}
  >
    {children}
  </Box>
);

const styles = StyleSheet.create({
  surface: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});
