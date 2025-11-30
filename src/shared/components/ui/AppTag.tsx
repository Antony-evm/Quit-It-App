import { StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { AppPressable } from './AppPressable';
import { Box } from './Box';
import {
  BACKGROUND,
  TEXT,
  SYSTEM,
  SPACING,
  BORDER_RADIUS,
  BORDER_WIDTH,
  hexToRgba,
} from '@/shared/theme';

type TagSize = 'small' | 'medium' | 'large';

export type AppTagProps = {
  label: string;
  color?: string;
  size?: TagSize;
  onPress?: () => void;
  selected?: boolean;
};

const SIZE_CONFIG: Record<
  TagSize,
  { textVariant: 'gridArea' | 'subcaption' | 'caption'; uppercase: boolean }
> = {
  small: { textVariant: 'gridArea', uppercase: true },
  medium: { textVariant: 'subcaption', uppercase: false },
  large: { textVariant: 'caption', uppercase: false },
};

export const AppTag = ({
  label,
  color,
  size = 'medium',
  onPress,
  selected = false,
}: AppTagProps) => {
  const isInteractive = !!onPress;

  const bg = selected
    ? TEXT.primary
    : color
    ? hexToRgba(color, 0.1)
    : BACKGROUND.muted;

  const textColor = selected ? BACKGROUND.primary : TEXT.primary;
  const borderColor = selected ? TEXT.primary : SYSTEM.border;

  const { textVariant, uppercase } = SIZE_CONFIG[size];

  const content = (
    <AppText
      variant={textVariant}
      style={[{ color: textColor }, uppercase && styles.uppercase]}
      bold
      centered
    >
      {label}
    </AppText>
  );

  if (isInteractive) {
    return (
      <AppPressable
        onPress={onPress}
        style={[
          styles.pressableBase,
          {
            backgroundColor: bg,
            borderRadius: BORDER_RADIUS.medium,
            borderColor,
            borderWidth: BORDER_WIDTH.sm,
          },
        ]}
      >
        {content}
      </AppPressable>
    );
  }

  return (
    <Box
      px="md"
      py="xs"
      borderRadius="full"
      style={{ backgroundColor: bg, alignSelf: 'flex-start' }}
    >
      {content}
    </Box>
  );
};

const styles = StyleSheet.create({
  uppercase: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pressableBase: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
