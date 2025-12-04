import { PressableProps, StyleSheet, ActivityIndicator } from 'react-native';

import { AppText } from './AppText';
import { AppPressable } from './AppPressable';
import {
  BACKGROUND,
  TEXT,
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  OPACITY,
  SHADOWS,
} from '../../theme';

export type AppButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  fullWidth?: boolean;
  loading?: boolean;
};

export const AppButton = ({
  label,
  fullWidth = false,
  loading = false,
  ...pressableProps
}: AppButtonProps) => {
  const isDisabled = pressableProps.disabled || loading;

  return (
    <AppPressable
      accessibilityRole="button"
      style={[styles.base, fullWidth && styles.fullWidth]}
      disabled={isDisabled}
      disabledOpacity={loading ? 1 : OPACITY.medium}
      activeOpacity={OPACITY.medium}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator color={TEXT.secondary} />
      ) : (
        <AppText variant="body" tone="inverse">
          {label}
        </AppText>
      )}
    </AppPressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: BACKGROUND.cream,
    ...SHADOWS.softLg,
    borderWidth: BORDER_WIDTH.none,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    textAlign: 'center',
  },
});
