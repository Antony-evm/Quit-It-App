import React from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { AppText, Box } from '@/shared/components/ui';
import { SPACING, TEXT, TypographyVariant } from '@/shared/theme';

export interface StatusMessageProps {
  message: string;
  type?: 'loading' | 'error' | 'info';
  style?: StyleProp<ViewStyle>;
  showSpinner?: boolean;
  variant?: TypographyVariant;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
  style,
  showSpinner = false,
  variant = 'body',
}) => {
  const config = {
    loading: {
      tone: 'primary',
    },
    error: {
      tone: 'error',
    },
    info: {
      tone: 'primary',
    },
  } as const;

  const { tone } = config[type];

  return (
    <Box gap="md" style={[styles.container, style]}>
      {showSpinner && <ActivityIndicator color={TEXT.primary} />}
      <AppText variant={variant} tone={tone} style={[styles.baseText]}>
        {message}
      </AppText>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  baseText: {
    textAlign: 'center',
  },
});
