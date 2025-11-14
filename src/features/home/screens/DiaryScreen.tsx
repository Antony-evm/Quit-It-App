import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { NotesCard } from '../components/NotesCard';
import { TrackingRecordsList } from '@/features/tracking/components/TrackingRecordsList';

export const DiaryScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <AppText variant="title" style={styles.title}>
            My Diary
          </AppText>
          <AppText tone="secondary" style={styles.subtitle}>
            Track your journey and thoughts along the way.
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
