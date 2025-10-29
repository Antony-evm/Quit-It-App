import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { COLOR_PALETTE, SPACING } from '../../theme';

export type AppSurfaceProps = PropsWithChildren<ViewProps>;

export const AppSurface = ({ style, children, ...viewProps }: AppSurfaceProps) => (
  <View style={[styles.surface, style]} {...viewProps}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  surface: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    padding: SPACING.xl,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});
