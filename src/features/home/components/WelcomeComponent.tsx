import { useWindowDimensions } from 'react-native';

import { AppText, Box } from '@/shared/components/ui';
import { DEVICE_HEIGHT } from '@/shared/theme';

type WelcomeComponentProps = {
  title: string;
  message: string;
  timeDifference: string;
};

export const WelcomeComponent = ({
  title,
  message,
  timeDifference,
}: WelcomeComponentProps) => {
  const { height } = useWindowDimensions();

  return (
    <Box
      variant="welcomeHeader"
      style={{ minHeight: height * 0.3, paddingTop: DEVICE_HEIGHT * 0.05 }}
    >
      <Box flex={1}>
        <Box mb="xs">
          <AppText variant="title">{title}</AppText>
        </Box>

        <Box flex={1} justifyContent="center">
          <AppText variant="heading">{message}</AppText>
          <Box variant="highlightCard" py="xl">
            <AppText variant="display" tone="brand">
              {timeDifference}
            </AppText>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
