import React, { useEffect, useRef } from 'react';
import { StyleSheet, ActivityIndicator, Animated } from 'react-native';
import { Box } from '@/shared/components/ui';
import { SYSTEM, SPACING } from '@/shared/theme';

export const LoadingScreen: React.FC = () => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Create a subtle pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [pulseAnim]);

  return (
    <Box
      style={styles.container}
      justifyContent="center"
      alignItems="center"
      bg="primary"
    >
      <Animated.View style={[styles.spinnerContainer, { opacity: pulseAnim }]}>
        <ActivityIndicator size="large" color={SYSTEM.brand} />
      </Animated.View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    elevation: 2,
  },
  spinnerContainer: {
    marginBottom: SPACING.lg,
  },
});
