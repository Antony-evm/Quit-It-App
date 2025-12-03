import React from 'react';
import { SvgProps } from 'react-native-svg';
import { AppText, Box, AppIcon } from '@/shared/components/ui';

interface IconTextCardProps {
  icon: React.FC<SvgProps>;
  text: string;
}

export const IconTextCard: React.FC<IconTextCardProps> = ({ icon, text }) => {
  return (
    <Box bg="primary" borderRadius="medium" p="lg">
      <Box flexDirection="row" alignItems="center" gap="md">
        <AppIcon icon={icon} />
        <AppText tone="primary" variant="body">
          {text}
        </AppText>
      </Box>
    </Box>
  );
};
