import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton, AppText } from '../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';
import { HomeEntriesPlaceholder, HomeEntry } from '../components/HomeEntriesPlaceholder';
import { HomeFooterNavigator, HomeFooterTab } from '../components/HomeFooterNavigator';
import { HomeStat, HomeStatsRow } from '../components/HomeStatsRow';

type HomePlaceholderScreenProps = {
  onStartOver?: () => void;
};

const STAT_CARDS: HomeStat[] = [
  { label: 'Cravings', value: '3', accentColor: '#C7D2FE' },
  { label: 'Cigarettes', value: '0', accentColor: '#FDBA74' },
  { label: 'Money Saved', value: '$18.50', accentColor: '#A7F3D0' },
];

const PLACEHOLDER_ENTRIES: HomeEntry[] = [
  {
    id: '1',
    title: 'Craving logged',
    timestamp: '10:24 AM',
    description: 'Paused for 5 minutes and had water.',
    type: 'craving',
  },
  {
    id: '2',
    title: 'Skipped cigarette',
    timestamp: '9:10 AM',
    description: 'Walked instead of smoking during break.',
    type: 'cigarette',
  },
  {
    id: '3',
    title: 'Craving logged',
    timestamp: '8:20 AM',
    description: 'Used breathing exercise from toolkit.',
    type: 'craving',
  },
];

export const HomePlaceholderScreen = ({ onStartOver }: HomePlaceholderScreenProps) => {
  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const stats = STAT_CARDS;
  const entries = PLACEHOLDER_ENTRIES;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View>
          <AppText variant="title" style={styles.title}>
            Keep the streak going
          </AppText>
          <AppText tone="secondary" style={styles.subtitle}>
            Here&apos;s how you&apos;ve been doing today.
          </AppText>
        </View>
        <HomeStatsRow stats={stats} style={styles.statsRow} />
        <HomeEntriesPlaceholder entries={entries} style={styles.entriesCard} />
        {onStartOver ? (
          <AppButton
            label="Restart questionnaire"
            onPress={onStartOver}
            containerStyle={styles.restartButton}
            tone="secondary"
          />
        ) : null}
      </View>
      <HomeFooterNavigator activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  title: {
    marginBottom: SPACING.sm,
  },
  subtitle: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    marginBottom: SPACING.xl,
  },
  entriesCard: {
    flex: 1,
    marginBottom: SPACING.xl,
  },
  restartButton: {
    marginTop: SPACING.md,
  },
});
