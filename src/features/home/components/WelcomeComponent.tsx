import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/shared/components/ui';
import { useAuth } from '@/shared/auth/AuthContext';
import { useQuittingPlan } from '@/features/questionnaire';
import { useSmokingAnalytics } from '@/features/tracking';
import { getFormattedTimeDifference } from '@/utils/dateUtils';
import {
  SPACING,
  COLOR_PALETTE,
  BRAND_COLORS,
  DEVICE_HEIGHT,
} from '@/shared/theme';

export const WelcomeComponent = () => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { plan } = useQuittingPlan();
  const { data: smokingAnalytics } = useSmokingAnalytics();

  const rawName = user?.firstName || user?.lastName || 'Friend';
  const formattedName =
    rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();
  const today = new Date();

  let message = '';
  let timeDifference = '';

  if (plan) {
    const status = plan.status;

    // Check for "Cut Down" or "Cut down first"
    if (status === 'Cut Down' || status === 'Cut down first') {
      message = 'Your next big milestone is in';
      timeDifference = getFormattedTimeDifference(today, plan.date);
    }
    // Check for "Quit It" or "Quit it"
    else if (status === 'Quit It' || status === 'Quit it') {
      if (today.getTime() < plan.date.getTime()) {
        message = 'You are going smoke free in';
        timeDifference = getFormattedTimeDifference(today, plan.date);
      } else if (today.getTime() > plan.date.getTime()) {
        if (smokingAnalytics?.last_smoking_day) {
          message = 'You are smoke free for';
          const lastSmokingDate = new Date(smokingAnalytics.last_smoking_day);
          timeDifference = getFormattedTimeDifference(lastSmokingDate, today);
        }
      }
    }
  }

  const showSpecificMessage = message !== '';

  return (
    <View style={[styles.container, { minHeight: height * 0.4 }]}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <AppText variant="title" style={styles.title}>
            Keep the streak going {formattedName}!
          </AppText>
        </View>

        <View style={styles.centerContent}>
          {showSpecificMessage ? (
            <>
              <AppText variant="body" style={styles.message}>
                {message}
              </AppText>
              <View style={styles.messageContainer}>
                <AppText variant="heading" style={styles.timeDifference}>
                  {timeDifference}
                </AppText>
              </View>
            </>
          ) : (
            <View style={styles.subtitleContainer}>
              <AppText tone="secondary" style={styles.subtitle}>
                Here&apos;s how you&apos;ve been doing today.
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 3,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    marginTop: DEVICE_HEIGHT * 0.05,

    // Elevation
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: SPACING.xs,
  },
  title: {
    marginBottom: SPACING.xs,
    fontSize: 28,
    lineHeight: 34,
  },
  subtitleContainer: {
    marginTop: SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
  },
  messageContainer: {
    marginTop: SPACING.sm,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    padding: SPACING.md,
    borderRadius: 12,
  },
  message: {
    marginBottom: SPACING.xs,
    color: COLOR_PALETTE.textMuted,
    fontSize: 18,
  },
  timeDifference: {
    color: BRAND_COLORS.mint,
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 0,
  },
});
