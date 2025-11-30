import React, { memo, useMemo } from 'react';
import { useWindowDimensions, ViewStyle } from 'react-native';

import { AppText, Box } from '@/shared/components/ui';

type WelcomeComponentProps = {
  title: string;
  message: string;
  timeDifference: string;
};

export const WelcomeComponent = memo(
  ({ title, message, timeDifference }: WelcomeComponentProps) => {
    const { height } = useWindowDimensions();

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
