import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '@/shared/components/ui';
import { SPACING, BRAND_COLORS } from '@/shared/theme';

interface WelcomeTextProps {
  isSignup: boolean;
}

export const WelcomeText: React.FC<WelcomeTextProps> = ({ isSignup }) => {
  const title = isSignup ? 'Welcome to Quit It' : 'Welcome Back';
  const subtitle = isSignup
    ? 'Your journey to quit smoking starts here'
    : 'Continue your smoke-free journey';

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
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.xs,
    fontWeight: 'bold',
    color: BRAND_COLORS.cream,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    color: BRAND_COLORS.cream,
    opacity: 0.9,
  },
});
