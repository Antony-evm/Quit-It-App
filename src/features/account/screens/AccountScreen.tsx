import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import {
  AppButton,
  AppSurface,
  AppText,
  AppTextInput,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

import { useAuth } from '@/shared/auth';
import { fetchQuitDate } from '../api/fetchQuitDate';
import { updateQuitDate } from '../api/updateQuitDate';
import type { QuitDate } from '../types';

type FieldStatus = {
  tone: 'success' | 'error';
  message: string;
} | null;

export const AccountScreen = () => {
  const { user } = useAuth();
  const [quitDate, setQuitDate] = useState<QuitDate | null>(null);
  const [quitDateInput, setQuitDateInput] = useState('');

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSavingQuitDate, setIsSavingQuitDate] = useState(false);

  const [quitDateStatus, setQuitDateStatus] = useState<FieldStatus>(null);

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
        // Intentionally ignored, error state already set.
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

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            tintColor={COLOR_PALETTE.textPrimary}
            colors={[COLOR_PALETTE.textPrimary]}
            progressBackgroundColor={COLOR_PALETTE.backgroundMuted}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        <View style={styles.header}>
          <AppText tone="primary" variant="title" style={styles.headerTitle}>
            Account Overview
          </AppText>
          <AppText
            tone="primary"
            variant="heading"
            style={styles.headerSubTitle}
          >
            Targets and personal profile, simplified.
          </AppText>
          <AppText tone="primary">
            Email:{' '}
            <AppText tone="primary" style={styles.emailText}>
              {user?.email ?? 'Not available'}
            </AppText>
          </AppText>
        </View>

        {error ? <AppText style={styles.globalError}>{error}</AppText> : null}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    marginBottom: SPACING.sm,
  },
  headerSubTitle: {
    marginBottom: SPACING.xl,
  },
  emailText: {
    textDecorationLine: 'underline',
    fontStyle: 'italic',
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
