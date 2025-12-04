import React, { memo, useEffect, useState } from 'react';

import { AppText, Box, ScreenHeader } from '@/shared/components/ui';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

type WelcomeComponentProps = {
  title: string;
  message: string;
  targetDate?: Date;
};

export const WelcomeComponent = memo(
  ({ title, message, targetDate }: WelcomeComponentProps) => {
    const [timeDifference, setTimeDifference] = useState('');

    useEffect(() => {
      if (!targetDate) {
        setTimeDifference('');
        return;
      }

      const updateTime = () => {
        const now = new Date();
        setTimeDifference(getFormattedTimeDifference(targetDate, now));
      };

      updateTime();
      const interval = setInterval(updateTime, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    const hasTimeDifference = Boolean(message && timeDifference);

    return (
      <Box px="xl" gap="md" accessibilityRole="header">
        <ScreenHeader title={title} subtitle={message} />

        {hasTimeDifference && (
          <Box variant="highlightCard">
            <AppText variant="display" tone="brand">
              {timeDifference}
            </AppText>
          </Box>
        )}
      </Box>
    );
  },
);

WelcomeComponent.displayName = 'WelcomeComponent';
