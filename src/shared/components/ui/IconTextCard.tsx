import React from 'react';
import { SvgProps } from 'react-native-svg';
import { AppText, Box, AppIcon } from '@/shared/components/ui';

interface IconTextCardProps {
  icon: React.FC<SvgProps>;
  text: string;
  label?: string;
  iconOpacity?: number;
}

export const IconTextCard: React.FC<IconTextCardProps> = ({
  icon,
  text,
  label,
  iconOpacity = 1,
}) => {
  return (
    <Box mb="md">
      {label && (
        <Box mb="sm">
          <AppText tone="primary" variant="body">
            {label}
          </AppText>
        </Box>
      )}
      <Box bg="primary" borderRadius="medium" p="lg">
        <Box flexDirection="row" alignItems="center" gap="md">
          <AppIcon
            icon={icon}
            fillOpacity={iconOpacity}
            strokeOpacity={iconOpacity}
          />
          <AppText tone="muted" variant="body">
            {text}
          </AppText>
        </Box>
      </Box>
    </Box>
  );
};
