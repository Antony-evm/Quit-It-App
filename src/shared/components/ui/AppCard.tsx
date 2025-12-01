import { ViewStyle, StyleProp, StyleSheet } from 'react-native';
import { Box, BoxProps } from './Box';
import {
  BACKGROUND,
  SYSTEM,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  BORDER_WIDTH,
} from '../../theme';

type CardVariant = 'elevated' | 'filled';
type CardSize = 'md' | 'lg';

export interface AppCardProps extends Omit<BoxProps, 'variant'> {
  variant?: CardVariant;
  size?: CardSize;
  style?: StyleProp<ViewStyle>;
}

const variantStyles = StyleSheet.create({
  elevated: {
    backgroundColor: BACKGROUND.primary,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    ...SHADOWS.softLg,
    gap: SPACING.md,
  },
  filled: {
    backgroundColor: BACKGROUND.muted,
  },
});

const sizeStyles = StyleSheet.create({
  md: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.medium,
  },
  lg: {
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.large,
  },
});

export const AppCard = ({
  variant = 'elevated',
  size = 'lg',
  children,
  style,
  ...boxProps
}: AppCardProps) => (
  <Box style={[variantStyles[variant], sizeStyles[size], style]} {...boxProps}>
    {children}
  </Box>
);
