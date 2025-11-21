import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Alert,
} from 'react-native';

import {
  AppButton,
  AppSurface,
  AppText,
  AppTextInput,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useAuth } from '@/shared/auth';
import { fetchUserGreeting } from '../api/fetchUserGreeting';
import { fetchUserEmail } from '../api/fetchUserEmail';
import { fetchSmokingTarget } from '../api/fetchSmokingTarget';
import { fetchQuitDate } from '../api/fetchQuitDate';
import { fetchNotificationSchedule } from '../api/fetchNotificationSchedule';
import { updateSmokingTarget } from '../api/updateSmokingTarget';
import { updateQuitDate } from '../api/updateQuitDate';
import { updateNotificationSchedule } from '../api/updateNotificationSchedule';
import type {
  NotificationSchedule,
  QuitDate,
  SmokingTarget,
  UserEmail,
  UserGreeting,
} from '../types';

type FieldStatus = {
  tone: 'success' | 'error';
  message: string;
} | null;

const formatGreeting = (value: UserGreeting | null) => {
  if (!value) {
    return 'Welcome back';
  }

  return `${value.greeting}, ${value.firstName}`;
};

const formatEmailAccessory = (value: UserEmail | null) => {
  if (!value) {
    return '';
  }

  return value.isVerified ? 'Verified' : 'Not verified';
};

export const AccountScreen = () => {
  const [greeting, setGreeting] = useState<UserGreeting | null>(null);
  const [email, setEmail] = useState<UserEmail | null>(null);
  const [smokingTarget, setSmokingTarget] = useState<SmokingTarget | null>(
    null,
  );
  const [smokingTargetInput, setSmokingTargetInput] = useState('');
  const [smokingTargetNote, setSmokingTargetNote] = useState('');
  const [quitDate, setQuitDate] = useState<QuitDate | null>(null);
  const [quitDateInput, setQuitDateInput] = useState('');
  const [notificationSchedule, setNotificationSchedule] =
    useState<NotificationSchedule | null>(null);
  const [notificationTimesInput, setNotificationTimesInput] = useState('');
  const [notificationTimezoneInput, setNotificationTimezoneInput] =
    useState('');

  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isSavingTarget, setIsSavingTarget] = useState(false);
  const [isSavingQuitDate, setIsSavingQuitDate] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const [targetStatus, setTargetStatus] = useState<FieldStatus>(null);
  const [quitDateStatus, setQuitDateStatus] = useState<FieldStatus>(null);
  const [scheduleStatus, setScheduleStatus] = useState<FieldStatus>(null);

  const { logout, user } = useAuth();

  const loadAccountData = useCallback(async () => {
    const responses = await Promise.all([
      fetchUserGreeting(),
      fetchUserEmail(),
      fetchSmokingTarget(),
      fetchQuitDate(),
      fetchNotificationSchedule(),
    ]);

    return responses;
  }, []);

  const hydrateState = useCallback(
    ([nextGreeting, nextEmail, nextTarget, nextQuitDate, nextSchedule]: [
      UserGreeting,
      UserEmail,
      SmokingTarget,
      QuitDate,
      NotificationSchedule,
    ]) => {
      setGreeting(nextGreeting);
      setEmail(nextEmail);
      setSmokingTarget(nextTarget);
      setSmokingTargetInput(String(nextTarget.perDay));
      setSmokingTargetNote(nextTarget.note ?? '');

      setQuitDate(nextQuitDate);
      setQuitDateInput(nextQuitDate.isoDate);

      setNotificationSchedule(nextSchedule);
      setNotificationTimesInput(nextSchedule.times.join(', '));
      setNotificationTimezoneInput(nextSchedule.timezone);
    },
    [],
  );

  const bootstrap = useCallback(async () => {
    try {
      setError(null);
      const responses = await loadAccountData();
      hydrateState(responses);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load account information.',
      );
      throw caughtError;
    }
  }, [hydrateState, loadAccountData]);

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

  const handleSaveSmokingTarget = useCallback(async () => {
    setTargetStatus(null);
    const parsedValue = Number(smokingTargetInput);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      setTargetStatus({
        tone: 'error',
        message: 'Enter a positive number for your target.',
      });
      return;
    }

    setIsSavingTarget(true);
    try {
      const updated = await updateSmokingTarget({
        perDay: parsedValue,
        note: smokingTargetNote.trim() || undefined,
      });
      setSmokingTarget(updated);
      setTargetStatus({
        tone: 'success',
        message: 'Smoking target updated.',
      });
    } catch {
      setTargetStatus({
        tone: 'error',
        message: 'Unable to update smoking target. Please try again.',
      });
    } finally {
      setIsSavingTarget(false);
    }
  }, [smokingTargetInput, smokingTargetNote]);

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

  const handleSaveNotificationSchedule = useCallback(async () => {
    setScheduleStatus(null);
    const normalizedTimes = notificationTimesInput
      .split(',')
      .map(time => time.trim())
      .filter(Boolean);

    if (!normalizedTimes.length) {
      setScheduleStatus({
        tone: 'error',
        message: 'Add at least one notification time.',
      });
      return;
    }

    const invalidTime = normalizedTimes.find(
      value => !/^\d{2}:\d{2}$/.test(value),
    );

    if (invalidTime) {
      setScheduleStatus({
        tone: 'error',
        message: `Time "${invalidTime}" is invalid. Use HH:MM (24h).`,
      });
      return;
    }

    setIsSavingSchedule(true);
    try {
      const updated = await updateNotificationSchedule({
        times: normalizedTimes,
        timezone: notificationTimezoneInput.trim() || undefined,
      });
      setNotificationSchedule(updated);
      setScheduleStatus({
        tone: 'success',
        message: 'Notification schedule updated.',
      });
    } catch {
      setScheduleStatus({
        tone: 'error',
        message: 'Unable to update notifications. Please retry.',
      });
    } finally {
      setIsSavingSchedule(false);
    }
  }, [notificationTimesInput, notificationTimezoneInput]);

  const handleLogout = useCallback(async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            // Navigation will be handled by the app navigator when auth state changes
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Error', 'Failed to log out. Please try again.');
          }
        },
      },
    ]);
  }, [logout]);

  const greetingText = useMemo(() => formatGreeting(greeting), [greeting]);
  const emailAccessory = useMemo(() => formatEmailAccessory(email), [email]);

  const notificationTimes = notificationSchedule?.times ?? [];

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
          <AppText variant="title" style={styles.headerTitle}>
            {greetingText}
          </AppText>
          <AppText tone="secondary">
            Keep your profile accurate so we can personalize your quit plan.
          </AppText>
        </View>

        {error ? <AppText style={styles.globalError}>{error}</AppText> : null}

        <AppSurface style={styles.card}>
          <AppText variant="heading" style={styles.cardTitle}>
            Contact
          </AppText>
          <AppText tone="secondary" style={styles.cardDescription}>
            This email is how we send session summaries and reminders.
          </AppText>
          <AppTextInput
            value={email?.email ?? ''}
            editable={false}
            selectTextOnFocus
            style={styles.textInput}
            placeholder="name@email.com"
          />
          <AppText variant="caption" tone="secondary">
            {emailAccessory}
          </AppText>
        </AppSurface>

        <AppSurface style={styles.card}>
          <AppText variant="heading" style={styles.cardTitle}>
            Smoking target
          </AppText>
          <AppText tone="secondary" style={styles.cardDescription}>
            Adjust your daily target so your plan stays realistic.
          </AppText>
          {smokingTarget ? (
            <AppText variant="caption" tone="secondary" style={styles.metaText}>
              Currently {smokingTarget.perDay} {smokingTarget.unit} per day
            </AppText>
          ) : null}
          <AppTextInput
            value={smokingTargetInput}
            onChangeText={setSmokingTargetInput}
            placeholder="e.g. 3"
            keyboardType="number-pad"
            style={styles.textInput}
            editable={!isLoading}
          />
          <AppTextInput
            value={smokingTargetNote}
            onChangeText={setSmokingTargetNote}
            placeholder="Add a note for your coach (optional)"
            style={styles.textInput}
            editable={!isLoading}
          />
          <AppButton
            label={isSavingTarget ? 'Saving...' : 'Save target'}
            onPress={handleSaveSmokingTarget}
            disabled={isSavingTarget || isLoading}
            fullWidth
          />
          {renderStatus(targetStatus)}
        </AppSurface>

        <AppSurface style={styles.card}>
          <AppText variant="heading" style={styles.cardTitle}>
            Quit date
          </AppText>
          <AppText tone="secondary" style={styles.cardDescription}>
            We use this to personalize milestones and streaks.
          </AppText>
          {quitDate ? (
            <AppText variant="caption" tone="secondary" style={styles.metaText}>
              Set for {quitDate.isoDate}
            </AppText>
          ) : null}
          <AppTextInput
            value={quitDateInput}
            onChangeText={setQuitDateInput}
            placeholder="YYYY-MM-DD"
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
            style={styles.textInput}
            editable={!isLoading}
          />
          <AppButton
            label={isSavingQuitDate ? 'Saving...' : 'Save quit date'}
            onPress={handleSaveQuitDate}
            disabled={isSavingQuitDate || isLoading}
            fullWidth
          />
          {renderStatus(quitDateStatus)}
        </AppSurface>

        <AppSurface style={styles.card}>
          <AppText variant="heading" style={styles.cardTitle}>
            Push notifications
          </AppText>
          <AppText tone="secondary" style={styles.cardDescription}>
            Choose when we nudge you with coping tools and reminders.
          </AppText>

          <View style={styles.chipsRow}>
            {notificationTimes.length ? (
              notificationTimes.map(time => (
                <View key={time} style={styles.chip}>
                  <AppText variant="caption">{time}</AppText>
                </View>
              ))
            ) : (
              <AppText tone="secondary" variant="caption">
                No notifications scheduled.
              </AppText>
            )}
          </View>

          <AppTextInput
            value={notificationTimesInput}
            onChangeText={setNotificationTimesInput}
            placeholder="08:00, 12:30, 20:15"
            style={styles.textInput}
            editable={!isLoading}
            multiline
          />
          <AppTextInput
            value={notificationTimezoneInput}
            onChangeText={setNotificationTimezoneInput}
            placeholder="Timezone (e.g. America/New_York)"
            style={styles.textInput}
            editable={!isLoading}
            autoCapitalize="none"
          />
          <AppButton
            label={isSavingSchedule ? 'Saving...' : 'Save schedule'}
            onPress={handleSaveNotificationSchedule}
            disabled={isSavingSchedule || isLoading}
            fullWidth
          />
          {renderStatus(scheduleStatus)}
        </AppSurface>

        <AppSurface style={styles.card}>
          <AppText variant="heading" style={styles.cardTitle}>
            Account Actions
          </AppText>
          <AppText tone="secondary" style={styles.cardDescription}>
            Logged in as {user?.email || 'Unknown'}
          </AppText>
          <AppButton
            label="Log Out"
            onPress={handleLogout}
            fullWidth
            variant="secondary"
          />
        </AppSurface>
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
  statusText: {
    marginTop: SPACING.sm,
  },
  statusTextError: {
    color: COLOR_PALETTE.systemError,
  },
  statusTextSuccess: {
    color: COLOR_PALETTE.textSecondary,
  },
  metaText: {
    marginBottom: SPACING.md,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
    marginBottom: SPACING.md,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    marginHorizontal: SPACING.xs,
    marginBottom: SPACING.xs,
  },
});
