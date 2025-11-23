import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLOR_PALETTE } from '@/shared/theme';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLOR_PALETTE.accentPrimary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    zIndex: 2,
    elevation: 2,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLOR_PALETTE.textPrimary,
  },
});
