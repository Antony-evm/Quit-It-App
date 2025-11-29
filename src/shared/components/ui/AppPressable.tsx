import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
  Animated,
  StyleSheet,
} from 'react-native';
import {
  COLOR_PALETTE,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TOUCH_TARGET_SIZE,
  INPUT_MIN_HEIGHT,
} from '@/shared/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableInteraction = 'opacity' | 'scale' | 'none';
type PressableVariant =
  | 'default'
  | 'icon'
  | 'tab'
  | 'chip'
  | 'input'
  | 'card'
  | 'toast'
  | 'backArrow';

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
    minHeight: INPUT_MIN_HEIGHT,
  },
  card: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    ...SHADOWS.softLg,
    elevation: 2,
  },
  toast: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backArrow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: TOUCH_TARGET_SIZE,
    height: TOUCH_TARGET_SIZE,
    borderRadius: TOUCH_TARGET_SIZE / 2,
    backgroundColor: COLOR_PALETTE.backgroundCream,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
    elevation: 5,
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
  toast: {},
  backArrow: {},
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
  const [isPressed, setIsPressed] = React.useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
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
    setIsPressed(false);
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
    <AnimatedPressable
      disabled={disabled}
      onPressIn={e => {
        handlePressIn();
        props.onPressIn?.(e);
      }}
      onPressOut={e => {
        handlePressOut();
        props.onPressOut?.(e);
      }}
      style={[
        variantStyles[variant],
        selected && selectedStyles[variant as keyof typeof selectedStyles],
        fullWidth && { width: '100%' },
        separator && {
          borderRightWidth: 1,
          borderRightColor: COLOR_PALETTE.borderDefault,
        },
        style,
        interaction === 'opacity' && isPressed && { opacity: activeOpacity },
        disabled && { opacity: disabledOpacity },
        interaction === 'scale' && { transform: [{ scale: animatedScale }] },
      ]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
};
