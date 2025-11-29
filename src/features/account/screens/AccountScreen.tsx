import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppSurface,
  AppText,
  AppTextInput,
  Logo,
} from '@/shared/components/ui';
import {
  BRAND_COLORS,
  COLOR_PALETTE,
  DEVICE_HEIGHT,
  SPACING,
  FOOTER_LAYOUT,
} from '@/shared/theme';
import EmailSvg from '@/assets/email.svg';

import { useAuth } from '@/shared/auth';
import { QuittingPlanDetails } from '@/features/questionnaire/components/QuittingPlanDetails';
import { TriggersList } from '@/features/questionnaire/components/TriggersList';
import { FrequencyData } from '@/features/questionnaire/components/FrequencyData';
import { useSmokingTriggersQuestion } from '@/features/questionnaire/hooks/useSmokingTriggersQuestion';
import { useSmokingFrequencyQuestion } from '@/features/questionnaire/hooks/useSmokingFrequencyQuestion';
import { fetchQuitDate } from '../api/fetchQuitDate';
import { updateQuitDate } from '../api/updateQuitDate';
import type { QuitDate } from '../types';
import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';

type FieldStatus = {
  tone: 'success' | 'error';
  message: string;
} | null;

type AccountSection = 'details' | 'plan' | 'triggers' | 'habits' | null;

export const AccountScreen = () => {
  const { user } = useAuth();
  const [quitDate, setQuitDate] = useState<QuitDate | null>(null);
  const [quitDateInput, setQuitDateInput] = useState('');

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSavingQuitDate, setIsSavingQuitDate] = useState(false);

  const [quitDateStatus, setQuitDateStatus] = useState<FieldStatus>(null);
  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  // Pre-fetch the smoking triggers question
  useSmokingTriggersQuestion();
  useSmokingFrequencyQuestion();

  const bootstrap = useCallback(async () => {
    try {
      setError(null);
      const nextQuitDate = await fetchQuitDate();
      setQuitDate(nextQuitDate);
      setQuitDateInput(nextQuitDate.isoDate);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load account information.',
      );
      throw caughtError;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const init = async () => {
      try {
        await bootstrap();
      } catch {
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [bootstrap]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await bootstrap();
    } finally {
      setIsRefreshing(false);
    }
  }, [bootstrap]);

  const handleSaveQuitDate = useCallback(async () => {
    setQuitDateStatus(null);
    const trimmed = quitDateInput.trim();
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);

    if (!isIsoDate || Number.isNaN(new Date(trimmed).getTime())) {
      setQuitDateStatus({
        tone: 'error',
        message: 'Use the YYYY-MM-DD format for your quit date.',
      });
      return;
    }

    setIsSavingQuitDate(true);
    try {
      const updated = await updateQuitDate({ isoDate: trimmed });
      setQuitDate(updated);
      setQuitDateStatus({
        tone: 'success',
        message: 'Quit date saved.',
      });
    } catch {
      setQuitDateStatus({
        tone: 'error',
        message: 'Unable to save quit date right now.',
      });
    } finally {
      setIsSavingQuitDate(false);
    }
  }, [quitDateInput]);

  const isLoading = isBootstrapping && !isRefreshing;

  const renderStatus = (status: FieldStatus) => {
    if (!status) {
      return null;
    }

    return (
      <AppText
        variant="caption"
        style={[
          styles.statusText,
          status.tone === 'error'
            ? styles.statusTextError
            : styles.statusTextSuccess,
        ]}
      >
        {status.message}
      </AppText>
    );
  };

  const renderDrawerContent = () => {
    switch (activeSection) {
      case 'details':
        return (
          <View style={styles.emailSection}>
            <View style={styles.emailRow}>
              <EmailSvg
                width={24}
                height={24}
                color={COLOR_PALETTE.textPrimary}
              />
              <AppText tone="primary">{user?.email ?? 'Not available'}</AppText>
            </View>
          </View>
        );
      case 'plan':
        return <QuittingPlanDetails />;
      case 'triggers':
        return <TriggersList style={styles.triggersCard} />;
      case 'habits':
        return <FrequencyData style={styles.frequencyCard} />;
      default:
        return null;
    }
  };

  const getDrawerTitle = () => {
    switch (activeSection) {
      case 'details':
        return 'Your Details';
      case 'plan':
        return 'Your Plan';
      case 'triggers':
        return 'Your Triggers';
      case 'habits':
        return 'Your Habits';
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            tintColor={COLOR_PALETTE.textPrimary}
            colors={[COLOR_PALETTE.textPrimary]}
            progressBackgroundColor={BRAND_COLORS.cream}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={styles.header}>
          <AppText tone="primary" variant="title" style={styles.headerTitle}>
            Your Quit It Profile
          </AppText>
        </View>

        <AccountSectionItem
          title="Your Details"
          onPress={() => setActiveSection('details')}
        />
        <AccountSectionItem
          title="Your Plan"
          onPress={() => setActiveSection('plan')}
        />
        <AccountSectionItem
          title="Your Triggers"
          onPress={() => setActiveSection('triggers')}
        />
        <AccountSectionItem
          title="Your Habits"
          onPress={() => setActiveSection('habits')}
        />

        {error ? <AppText style={styles.globalError}>{error}</AppText> : null}
      </ScrollView>

      <BottomDrawer
        visible={!!activeSection}
        onClose={() => setActiveSection(null)}
        title={getDrawerTitle()}
      >
        {renderDrawerContent()}
      </BottomDrawer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    marginTop: DEVICE_HEIGHT * 0.05,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2, // Add extra padding for FAB overlap
  },
  header: {
    marginBottom: SPACING.xxl,
  },
  planCard: {
    marginBottom: SPACING.xl,
  },
  emailSection: {
    backgroundColor: BRAND_COLORS.ink,
    padding: SPACING.lg,
    borderRadius: 8,
    marginBottom: SPACING.lg,
  },
  emailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  headerTitle: {
    marginBottom: SPACING.sm,
    textAlign: 'left',
  },
  headerSubTitle: {
    marginBottom: SPACING.xl,
  },
  logo: {
    marginTop: SPACING.lg,
  },
  triggersCard: {
    marginBottom: SPACING.xl,
  },
  frequencyCard: {
    marginBottom: SPACING.xl,
  },
  globalError: {
    color: COLOR_PALETTE.systemError,
    marginBottom: SPACING.lg,
  },
  card: {
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    marginBottom: SPACING.xs,
  },
  cardDescription: {
    marginBottom: SPACING.md,
  },
  textInput: {
    marginBottom: SPACING.md,
  },
  metaText: {
    marginBottom: SPACING.md,
  },
  statusText: {
    marginTop: SPACING.sm,
  },
  statusTextError: {
    color: COLOR_PALETTE.systemError,
  },
  statusTextSuccess: {
    color: COLOR_PALETTE.textSecondary,
  },
});
