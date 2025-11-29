import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '@/types/navigation';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { AppButton, AppText, Box } from '@/shared/components/ui';
import { useSubscription } from '../hooks/useSubscription';
import { UserStatusService } from '@/shared/services/userStatusService';
import { useUserStatusUpdate } from '@/shared/hooks';

export const PaywallScreen = ({
  navigation,
}: RootStackScreenProps<'Paywall'>) => {
  const { handleUserStatusUpdateWithNavigation } = useUserStatusUpdate();
  const { mutateAsync: subscribe, isPending: isSubscribing } =
    useSubscription();

  const handleSubscribe = async () => {
    try {
      const response = await subscribe();

      // Update user status and handle navigation using the centralized hook
      await handleUserStatusUpdateWithNavigation(response, navigation);

      // Show success message
      Alert.alert('Success!', response.message || 'Successfully subscribed!', [
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert(
        'Subscription Failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
        [{ text: 'OK' }],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Box flex={1} px="lg" justifyContent="space-between">
        <Box alignItems="center" style={styles.headerMargin}>
          <AppText variant="heading" style={styles.title}>
            🎉 You're Almost Ready!
          </AppText>
          <AppText variant="body" tone="secondary" style={styles.subtitle}>
            Complete your journey with premium access to all features and
            personalized tracking.
          </AppText>
        </Box>

        <Box flex={1} justifyContent="center" py="xl">
          <Box mb="lg" px="sm">
            <AppText variant="body" style={styles.featureText}>
              ✨ Personalized quit plan based on your responses
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="body" style={styles.featureText}>
              📊 Advanced progress tracking and insights
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="body" style={styles.featureText}>
              🎯 Daily motivation and milestone celebrations
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="body" style={styles.featureText}>
              🔒 Secure, private data with backup protection
            </AppText>
          </Box>
        </Box>

        <Box pb="lg">
          <AppButton
            label={isSubscribing ? 'Processing...' : 'Get Premium Access'}
            onPress={handleSubscribe}
            disabled={isSubscribing}
            variant="primary"
            size="lg"
            fullWidth
          />
          <AppText variant="caption" tone="secondary" style={styles.disclaimer}>
            By subscribing, you agree to our terms of service. Cancel anytime.
          </AppText>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  headerMargin: {
    marginTop: SPACING.xl * 2,
  },
  title: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: COLOR_PALETTE.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  featureText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLOR_PALETTE.textPrimary,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: SPACING.md,
    fontSize: 12,
    lineHeight: 16,
  },
});
