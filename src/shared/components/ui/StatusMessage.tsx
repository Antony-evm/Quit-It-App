import React from 'react';
import {
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';

export interface StatusMessageProps {
  message: string;
  type?: 'loading' | 'error' | 'info';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  showSpinner?: boolean;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  type = 'info',
  style,
  textStyle,
  showSpinner = false,
}) => {
  const getBaseTextStyle = () => {
    switch (type) {
      case 'loading':
        return styles.loadingText;
      case 'error':
        return styles.errorText;
      default:
        return styles.defaultText;
    }
  };

  const getTone = () => {
    switch (type) {
      case 'loading':
        return 'secondary';
      default:
        return 'primary';
    }
  };

  return (
    <Box gap="md" style={[styles.container, style]}>
      {showSpinner && <ActivityIndicator color={COLOR_PALETTE.accentPrimary} />}
      <AppText tone={getTone()} style={[getBaseTextStyle(), textStyle]}>
        {message}
      </AppText>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    color: COLOR_PALETTE.systemError,
  },
  defaultText: {
    textAlign: 'center',
  },
});
