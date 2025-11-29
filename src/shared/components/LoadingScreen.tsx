import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { Box, AppText } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      style={styles.container}
      justifyContent="center"
      alignItems="center"
      bg="backgroundPrimary"
    >
      <ActivityIndicator size="large" color={COLOR_PALETTE.accentPrimary} />
      <AppText variant="body" style={styles.loadingText}>
        Loading...
      </AppText>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    elevation: 2,
  },
  loadingText: {
    marginTop: 16,
  },
});
