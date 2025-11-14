import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { DiaryScreen } from './DiaryScreen';
import {
  HomeEntriesPlaceholder,
  HomeEntry,
} from '../components/HomeEntriesPlaceholder';
import {
  HomeFooterNavigator,
  HomeFooterTab,
} from '../components/HomeFooterNavigator';
import { HomeStat, HomeStatsRow } from '../components/HomeStatsRow';

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

export const HomePlaceholderScreen = () => {
  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const stats = STAT_CARDS;
  const entries = PLACEHOLDER_ENTRIES;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const renderHomeTab = () => (
    <>
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
    </>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <View style={styles.accountWrapper}>
            <AccountScreen />
          </View>
        );
      case 'diary':
        return (
          <View style={styles.diaryWrapper}>
            <DiaryScreen />
          </View>
        );
      case 'home':
      default:
        return renderHomeTab();
    }
  };

  const shouldHideFooter = isKeyboardVisible;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View
        style={[
          styles.content,
          shouldHideFooter ? styles.contentExpanded : undefined,
        ]}
      >
        {renderContent()}
      </View>
      {!shouldHideFooter ? (
        <HomeFooterNavigator activeTab={activeTab} onTabChange={setActiveTab} />
      ) : null}
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
  contentExpanded: {
    paddingBottom: SPACING.md,
  },
  accountWrapper: {
    flex: 1,
  },
  diaryWrapper: {
    flex: 1,
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
});
