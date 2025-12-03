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
  BACKGROUND,
  TEXT,
  SYSTEM,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  TOUCH_TARGET_SIZE,
  INPUT_MIN_HEIGHT,
  ANSWER_GRID_MIN_HEIGHT,
  BORDER_WIDTH,
  OPACITY,
} from '@/shared/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type PressableVariant =
  | 'default'
  | 'icon'
  | 'tab'
  | 'chip'
  | 'input'
  | 'inputInverse'
  | 'card'
  | 'toast'
  | 'backArrow'
  | 'answerGrid'
  | 'delete';

export type AppPressableProps = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  variant?: PressableVariant;
  selected?: boolean;
  fullWidth?: boolean;
  activeOpacity?: number;
  disabledOpacity?: number;
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
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    backgroundColor: BACKGROUND.muted,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND.primary,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: INPUT_MIN_HEIGHT,
  },
  inputInverse: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BACKGROUND.muted,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.lg,
    minHeight: INPUT_MIN_HEIGHT,
  },
  card: {
    backgroundColor: BACKGROUND.primary,
    borderRadius: BORDER_RADIUS.large,
    padding: SPACING.xl,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    ...SHADOWS.softLg,
    elevation: 2,
  },
  toast: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backArrow: {
    width: TOUCH_TARGET_SIZE,
    height: TOUCH_TARGET_SIZE,
    borderRadius: TOUCH_TARGET_SIZE / 2,
    backgroundColor: TEXT.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.sm,
    elevation: 5,
  },
  answerGrid: {
    borderRadius: BORDER_RADIUS.medium,
    minHeight: ANSWER_GRID_MIN_HEIGHT,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    flexBasis: '40%',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BACKGROUND.primary,
    borderWidth: BORDER_WIDTH.sm,
    borderColor: SYSTEM.border,
    ...SHADOWS.softXl,
  },
  delete: {
    backgroundColor: BACKGROUND.dark,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
});

const selectedStyles: Partial<Record<PressableVariant, ViewStyle>> = {
  chip: {
    backgroundColor: TEXT.primary,
    borderColor: TEXT.primary,
  },
  answerGrid: {
    backgroundColor: BACKGROUND.cream,
    borderColor: SYSTEM.accentPrimary,
  },
};

export const AppPressable = ({
  children,
  style,
  variant = 'default',
  selected = false,
  fullWidth = false,
  activeOpacity = OPACITY.medium,
  disabledOpacity = OPACITY.disabled,
  disabled,
  ...props
}: AppPressableProps) => {
  const [isPressed, setIsPressed] = React.useState(false);

  return (
    <AnimatedPressable
      disabled={disabled}
      onPressIn={e => {
        setIsPressed(true);
        props.onPressIn?.(e);
      }}
      onPressOut={e => {
        setIsPressed(false);
        props.onPressOut?.(e);
      }}
      style={[
        variantStyles[variant],
        selected && selectedStyles[variant],
        fullWidth && { width: '100%' },
        style,
        isPressed && { opacity: activeOpacity },
        disabled && { opacity: disabledOpacity },
      ]}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
};
