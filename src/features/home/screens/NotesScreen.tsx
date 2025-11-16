import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';

import { AppText } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import { NotesCard } from '../components/NotesCard';
import { TrackingRecordsList } from '@/features/tracking/components/TrackingRecordsList';
import { DEFAULT_TRACKING_USER_ID } from '@/features/tracking/constants';

export const NotesScreen = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const queryKey = ['trackingRecords', 'infinite', DEFAULT_TRACKING_USER_ID];
    queryClient.resetQueries({ queryKey });
  }, [queryClient]);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="title" style={styles.title}>
            Your Quit Journal
          </AppText>
          <AppText tone="secondary" style={styles.subtitle}>
            Reflect, reset, and strengthen the smoke-free version of you.
            Logging cravings shows you how far you've come and what strengthens
            you.
          </AppText>
        </View>
        <NotesCard />
        <TrackingRecordsList />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING.xl,
  },
});
