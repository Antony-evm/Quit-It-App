import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
} from 'react-native';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';

type PressableInteraction = 'opacity' | 'scale' | 'none';
type PressableVariant = 'default' | 'icon' | 'tab' | 'chip' | 'input' | 'card';

export type AppPressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  interaction?: PressableInteraction;
  variant?: PressableVariant;
  selected?: boolean;
  fullWidth?: boolean;
  separator?: boolean;
  activeOpacity?: number;
  disabledOpacity?: number;
  scaleValue?: number;
};

const variantStyles = StyleSheet.create({
  default: {},
  icon: {
    padding: SPACING.xs,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  chip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: 64,
  },
  card: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
  },
});

const selectedStyles = StyleSheet.create({
  default: {},
  icon: {},
  tab: {},
  chip: {
    backgroundColor: COLOR_PALETTE.textPrimary,
    borderColor: COLOR_PALETTE.textPrimary,
  },
  input: {},
  card: {
    borderColor: COLOR_PALETTE.accentPrimary,
    backgroundColor: COLOR_PALETTE.backgroundCream,
  },
});

export const AppPressable = ({
  children,
  style,
  interaction = 'opacity',
  variant = 'default',
  selected = false,
  fullWidth = false,
  separator = false,
  activeOpacity = 0.7,
  disabledOpacity = 0.5,
  scaleValue = 0.96,
  disabled,
  ...props
}: AppPressableProps) => {
  const animatedScale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (interaction === 'scale') {
      Animated.spring(animatedScale, {
        toValue: scaleValue,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (interaction === 'scale') {
      Animated.spring(animatedScale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    }
  };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={e => {
        handlePressIn();
        props.onPressIn?.(e);
      }}
      onPressOut={e => {
        handlePressOut();
        props.onPressOut?.(e);
      }}
      style={({ pressed }) => [
        variantStyles[variant],
        selected && selectedStyles[variant as keyof typeof selectedStyles],
        fullWidth && { width: '100%' },
        separator && {
          borderRightWidth: 1,
          borderRightColor: COLOR_PALETTE.borderDefault,
        },
        style,
        interaction === 'opacity' && pressed && { opacity: activeOpacity },
        disabled && { opacity: disabledOpacity },
        interaction === 'scale' && { transform: [{ scale: animatedScale }] },
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
};
