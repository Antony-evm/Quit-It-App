import React, { memo, useEffect, useMemo, useState } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';

import { AppText, Box } from '@/shared/components/ui';
import { getFormattedTimeDifference } from '@/utils/dateUtils';

type WelcomeComponentProps = {
  title: string;
  message: string;
  targetDate?: Date;
};

export const WelcomeComponent = memo(
  ({ title, message, targetDate }: WelcomeComponentProps) => {
    const { height } = useWindowDimensions();
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

    const containerStyle = useMemo<ViewStyle>(
      () => ({
        minHeight: height * 0.3,
        paddingTop: height * 0.05,
      }),
      [height],
    );

    const hasTimeDifference = Boolean(message && timeDifference);

    return (
      <Box
        variant="welcomeHeader"
        style={containerStyle}
        accessibilityRole="header"
      >
        <Box flex={1}>
          <Box mb="xs">
            <AppText variant="title">{title}</AppText>
          </Box>

          {hasTimeDifference && (
            <Box flex={1} justifyContent="center">
              <AppText variant="heading">{message}</AppText>
              <Box variant="highlightCard" py="xl">
                <AppText variant="display" tone="brand">
                  {timeDifference}
                </AppText>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  },
);

WelcomeComponent.displayName = 'WelcomeComponent';
