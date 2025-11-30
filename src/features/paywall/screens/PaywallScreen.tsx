import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '@/types/navigation';
import { BACKGROUND, TEXT, SPACING } from '@/shared/theme';
import { AppButton, AppText, Box, ScreenHeader } from '@/shared/components/ui';
import { usePaywallLogic } from '../hooks/usePaywallLogic';

export const PaywallScreen = ({
  navigation: _navigation,
}: RootStackScreenProps<'Paywall'>) => {
  const { handleSubscribe, isSubscribing } = usePaywallLogic();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <Box flex={1} px="lg" justifyContent="space-between">
        <Box alignItems="center" mt="xxl" pt="xl">
          <ScreenHeader
            title="You're Almost Ready!"
            subtitle="Complete your journey with premium access to all features and personalized tracking."
            variant="paywall"
          />
        </Box>

        <Box flex={1} justifyContent="center" py="xl">
          <Box mb="lg" px="sm">
            <AppText variant="caption" style={styles.featureText}>
              - Personalized quit plan based on your responses
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="caption" style={styles.featureText}>
              - Advanced progress tracking and insights
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="caption" style={styles.featureText}>
              - Daily motivation and milestone celebrations
            </AppText>
          </Box>
          <Box mb="lg" px="sm">
            <AppText variant="caption" style={styles.featureText}>
              - Secure, private data with backup protection
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
          <AppText
            variant="gridArea"
            tone="secondary"
            style={styles.disclaimer}
          >
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
    backgroundColor: BACKGROUND.primary,
  },
  featureText: {
    color: TEXT.primary,
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: SPACING.md,
  },
});
