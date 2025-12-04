import { useState, useCallback } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';
import { AppCard, AppText, Box, AppIcon } from '@/shared/components/ui';
import {
  SPACING,
  BORDER_WIDTH,
  BACKGROUND,
  SYSTEM,
  SHADOWS,
} from '@/shared/theme';
import ChevronRightIcon from '@/assets/chevronRight.svg';

type AccountSectionItemProps = {
  title: string;
  description: string;
  onPress: () => void;
};

export const AccountSectionItem = ({
  title,
  description,
  onPress,
}: AccountSectionItemProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = useCallback(() => setIsPressed(true), []);
  const handlePressOut = useCallback(() => setIsPressed(false), []);

  const pressedStyle: ViewStyle = isPressed
    ? { backgroundColor: BACKGROUND.pressed }
    : {};

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <AppCard size="md" style={[styles.card, pressedStyle]}>
        <Box
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex={1} gap="sm" style={{ marginRight: SPACING.md }}>
            <AppText variant="body" tone="primary" bold>
              {title}
            </AppText>
            <AppText
              variant="caption"
              tone="muted"
              style={{ marginTop: SPACING.xs }}
            >
              {description}
            </AppText>
          </Box>
          <AppIcon icon={ChevronRightIcon} variant="default" />
        </Box>
      </AppCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.lg,
    borderWidth: BORDER_WIDTH.md,
    borderColor: SYSTEM.borderLight,
    ...SHADOWS.ambientGlow,
  },
});
