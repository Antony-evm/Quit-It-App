import React from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';

type QuestionHeaderProps = {
  title: string;
  subtitle?: string;
};

export const QuestionHeader = ({ title, subtitle }: QuestionHeaderProps) => (
  <View>
    <AppText variant="title">{title}</AppText>
    {subtitle ? (
      <AppText variant="body" tone="secondary">
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

const styles = StyleSheet.create({});
