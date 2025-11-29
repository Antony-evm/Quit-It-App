import React from 'react';

import { AppText, Box } from '@/shared/components/ui';

type QuestionHeaderProps = {
  title: string;
  subtitle?: string;
};

export const QuestionHeader = ({ title, subtitle }: QuestionHeaderProps) => (
  <Box>
    <AppText variant="title">{title}</AppText>
    {subtitle ? (
      <AppText variant="body" tone="secondary">
        {subtitle}
      </AppText>
    ) : null}
  </Box>
);
