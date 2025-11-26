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
import { QuittingPlanCard } from '@/features/questionnaire/components/QuittingPlanCard';
import { useCravingAnalytics, useSmokingAnalytics, CravingChart } from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { useQuittingPlan } from '@/features/questionnaire';
import { NotesScreen } from './NotesScreen';
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
  { label: 'Cigarettes', value: '0', accentColor: '#cf1515ff' },
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

export const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Add craving analytics hook at the top with other hooks
  const { data: cravingAnalytics, isLoading, error } = useCravingAnalytics();
  
  // Add smoking analytics hook
  const { data: smokingAnalytics } = useSmokingAnalytics();
  
  // Add quitting plan hook to check status
  const { plan: quittingPlan } = useQuittingPlan();

  // Add some debugging
  console.log('HomeScreen - Craving Analytics Data:', {
    data: cravingAnalytics,
    isLoading,
    error: error?.message,
    totalCravings: cravingAnalytics?.total_cravings,
    cravingsByDay: cravingAnalytics?.cravings_by_day,
  });

  // Convert cravings_by_day to daily_data format for the chart
  const dailyData: DailyCravingData[] = cravingAnalytics?.cravings_by_day
    ? Object.entries(cravingAnalytics.cravings_by_day)
        .map(([date, count]) => ({
          date,
          count,
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
    : [];

  // Calculate dynamic stats based on analytics data
  const stats: HomeStat[] = [
    {
      label: 'Cravings',
      value: cravingAnalytics?.total_cravings?.toString() || '0',
      accentColor: '#C7D2FE',
    },
    { 
      label: 'Skipped Cigarettes', 
      value: smokingAnalytics?.skipped_smokes?.toString() || '0', 
      accentColor: '#FDBA74' 
    },
    { 
      label: 'Money Saved', 
      value: smokingAnalytics?.savings ? `$${smokingAnalytics.savings.toFixed(2)}` : '$0.00', 
      accentColor: '#A7F3D0' 
    },
  ];

  const entries = PLACEHOLDER_ENTRIES;

  // Helper function to calculate days since last smoking day
  const calculateDaysSmokeFree = (): number => {
    if (!smokingAnalytics?.last_smoking_day) return 0;
    const lastSmokingDate = new Date(smokingAnalytics.last_smoking_day);
    const today = new Date();
    const diffTime = today.getTime() - lastSmokingDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  // Check if we should show smoke-free message
  const shouldShowSmokeFreeMessage = quittingPlan?.status !== 'Cut down first';
  const daysSmokeFree = calculateDaysSmokeFree();

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
        {shouldShowSmokeFreeMessage && daysSmokeFree > 0 && (
          <AppText 
            variant="body" 
            style={[styles.congratsMessage, { color: '#22C55E' }]}
          >
            🎉 Congrat&apos;s you&apos;ve been smoke free for {daysSmokeFree} {daysSmokeFree === 1 ? 'day' : 'days'}!
          </AppText>
        )}
      </View>
      <QuittingPlanCard style={styles.planCard} />
      <HomeStatsRow stats={stats} style={styles.statsRow} />
      {dailyData && dailyData.length > 0 && (
        <CravingChart data={dailyData} style={styles.chartCard} />
      )}
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
      case 'notes':
        return (
          <View style={styles.notesWrapper}>
            <NotesScreen />
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
  notesWrapper: {
    flex: 1,
  },
  title: {
    marginBottom: SPACING.xs,
  },
  subtitle: {
    marginBottom: SPACING.lg,
  },
  congratsMessage: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  planCard: {
    marginBottom: SPACING.xl,
  },
  statsRow: {
    marginBottom: SPACING.xl,
  },
  chartCard: {
    marginBottom: SPACING.xl,
  },
  entriesCard: {
    flex: 1,
    marginBottom: SPACING.xl,
  },
});
