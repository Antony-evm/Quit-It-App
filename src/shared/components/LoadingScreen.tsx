import React from 'react';
import { StyleSheet } from 'react-native';
import { Box, StatusMessage } from '@/shared/components/ui';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      style={styles.container}
      justifyContent="center"
      alignItems="center"
      bg="backgroundPrimary"
    >
      <StatusMessage type="loading" message="Loading..." showSpinner />
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 2,
    elevation: 2,
  },
});
