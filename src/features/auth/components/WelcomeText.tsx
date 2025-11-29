import React from 'react';
import { StyleSheet } from 'react-native';
import { AppText, Box } from '@/shared/components/ui';
import { SPACING, COLOR_PALETTE, TYPOGRAPHY } from '@/shared/theme';

interface WelcomeTextProps {
  isSignup: boolean;
}

export const WelcomeText: React.FC<WelcomeTextProps> = ({ isSignup }) => {
  const title = isSignup ? 'It starts with one choice!' : 'Welcome Back!';
  const subtitle = isSignup
    ? 'Make yours with Quit It today.'
    : 'Continue your smoke-free journey.';

  return (
    <Box alignItems="center" bg="backgroundPrimary" pt="xxl">
      <AppText variant="title" tone="inverse" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" tone="inverse" style={styles.subtitle}>
        {subtitle}
      </AppText>
    </Box>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
    ...TYPOGRAPHY.title,
    color: COLOR_PALETTE.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: COLOR_PALETTE.textPrimary,
    ...TYPOGRAPHY.caption,
  },
});
