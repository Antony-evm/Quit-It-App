import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { SvgProps } from 'react-native-svg';
import { AppText, Box, AppIcon } from '@/shared/components/ui';

interface IconTextCardProps {
  icon: React.FC<SvgProps>;
  text: string;
  style?: StyleProp<ViewStyle>;
}

export const IconTextCard: React.FC<IconTextCardProps> = ({
  icon,
  text,
  style,
}) => {
  return (
    <Box bg="backgroundPrimary" borderRadius="small" p="lg" style={style}>
      <Box flexDirection="row" alignItems="center" gap="sm">
        <AppIcon icon={icon} />
        <AppText tone="primary" variant="body">
          {text}
        </AppText>
      </Box>
    </Box>
  );
};
