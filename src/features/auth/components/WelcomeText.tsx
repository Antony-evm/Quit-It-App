import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { SPACING, BRAND_COLORS, TYPOGRAPHY } from '@/shared/theme';

interface WelcomeTextProps {
  isSignup: boolean;
}

export const WelcomeText: React.FC<WelcomeTextProps> = ({ isSignup }) => {
  const title = isSignup ? 'It starts with one choice!' : 'Welcome Back!';
  const subtitle = isSignup
    ? 'Make yours with Quit It today.'
    : 'Continue your smoke-free journey.';

  return (
    <View style={styles.container}>
      <AppText variant="title" tone="inverse" style={styles.title}>
        {title}
      </AppText>
      <AppText variant="body" tone="inverse" style={styles.subtitle}>
        {subtitle}
      </AppText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.ink,
    paddingTop: SPACING.xxl,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.sm,
    ...TYPOGRAPHY.title,
    color: BRAND_COLORS.cream,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.lg,
    color: BRAND_COLORS.cream,
    ...TYPOGRAPHY.caption,
  },
});
