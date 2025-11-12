import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';

type QuestionHeaderProps = {
  title: string;
  subtitle?: string;
};

export const QuestionHeader = ({ title, subtitle }: QuestionHeaderProps) => (
  <View style={styles.container}>
    <AppText variant="title">{title}</AppText>
    {subtitle ? (
      <AppText variant="body" tone="secondary" style={styles.subtitle}>
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  subtitle: {
    marginBottom: SPACING.md,
  },
});
