import React, { useEffect, useState, useRef } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText, DraggableModal, AppSurface } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { QuittingPlanCard } from '@/features/questionnaire/components/QuittingPlanCard';
import {
  useCravingAnalytics,
  useSmokingAnalytics,
  CravingChart,
} from '@/features/tracking';
import { DailyCravingData } from '@/features/tracking/types';
import { useQuittingPlan } from '@/features/questionnaire';
import { JournalScreen } from './JournalScreen';
import { NotesCard, NotesCardHandle } from '../components/NotesCard';
import {
  HomeFooterNavigator,
  HomeFooterTab,
} from '../components/HomeFooterNavigator';
import { HomeStat, HomeStatsRow } from '../components/HomeStatsRow';
import CancelIcon from '@/assets/cancel.svg';

const STAT_CARDS: HomeStat[] = [
  { label: 'Cravings', value: '3', accentColor: '#C7D2FE' },
  { label: 'Cigarettes', value: '0', accentColor: '#cf1515ff' },
  { label: 'Money Saved', value: '$18.50', accentColor: '#A7F3D0' },
];

export const HomeScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const mainScrollViewRef = useRef<ScrollView>(null);
  const noteDrawerScrollRef = useRef<ScrollView>(null);
  const notesCardRef = useRef<NotesCardHandle>(null);

  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const { data: cravingAnalytics, isLoading, error } = useCravingAnalytics();

  const { data: smokingAnalytics } = useSmokingAnalytics();

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
      accentColor: '#FDBA74',
    },
    {
      label: 'Money Saved',
      value: smokingAnalytics?.savings
        ? `$${smokingAnalytics.savings.toFixed(2)}`
        : '$0.00',
      accentColor: '#A7F3D0',
    },
  ];

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

  // Sync activeTab with ScrollView position
  useEffect(() => {
    if (mainScrollViewRef.current) {
      let index = 1; // Default to home
      if (activeTab === 'account') index = 0;
      if (activeTab === 'home') index = 1;
      if (activeTab === 'journal') index = 2;

      mainScrollViewRef.current.scrollTo({
        x: index * screenWidth,
        animated: true,
      });
    }
  }, [activeTab, screenWidth]);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / screenWidth);

    let newTab: HomeFooterTab = 'home';
    if (index === 0) newTab = 'account';
    if (index === 1) newTab = 'home';
    if (index === 2) newTab = 'journal';

    if (newTab !== activeTab) {
      setActiveTab(newTab);
    }
  };

  const renderHomeTab = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View>
        <AppText variant="title" style={styles.title}>
          Keep the streak going
        </AppText>
        <AppText tone="secondary" style={styles.subtitle}>
          Here&apos;s how you&apos;ve been doing today.
        </AppText>
        {shouldShowSmokeFreeMessage && daysSmokeFree > 0 && (
          <View style={styles.congratsContainer}>
            <AppText
              variant="body"
              style={[styles.congratsMessage, { color: '#22C55E' }]}
            >
              🎉 Congrat&apos;s you&apos;ve been smoke free for {daysSmokeFree}{' '}
              {daysSmokeFree === 1 ? 'day' : 'days'}!
            </AppText>
          </View>
        )}
      </View>

      <HomeStatsRow stats={stats} style={styles.statsRow} />

      {dailyData && dailyData.length > 0 && (
        <CravingChart data={dailyData} style={styles.chartCard} />
      )}

      <View style={styles.planSection}>
        <AppText variant="heading" style={styles.sectionTitle}>
          Your Plan
        </AppText>
        <AppSurface style={styles.planCard}>
          <QuittingPlanCard />
        </AppSurface>
      </View>
    </ScrollView>
  );

  const shouldHideFooter = isKeyboardVisible || isNoteDrawerVisible;

  const renderHeaderContent = () => (
    <View style={styles.modalHeaderContent}>
      <Pressable
        onPress={() => setIsNoteDrawerVisible(false)}
        style={styles.headerButton}
        hitSlop={10}
      >
        <CancelIcon width={24} height={24} color={BRAND_COLORS.cream} />
      </Pressable>

      <Pressable
        onPress={() => notesCardRef.current?.save()}
        style={styles.headerButton}
        hitSlop={10}
      >
        {({ pressed }) => (
          <AppText
            variant="body"
            style={[styles.saveButtonText, pressed && { opacity: 0.7 }]}
          >
            Save
          </AppText>
        )}
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={mainScrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        style={[
          styles.contentContainer,
          shouldHideFooter ? styles.contentExpanded : undefined,
        ]}
        contentContainerStyle={{ width: screenWidth * 3 }}
        scrollEnabled={!shouldHideFooter} // Disable swipe when keyboard is open
      >
        <View style={[styles.page, { width: screenWidth }]}>
          <View style={styles.accountWrapper}>
            <AccountScreen />
          </View>
        </View>
        <View style={[styles.page, { width: screenWidth }]}>
          {renderHomeTab()}
        </View>
        <View style={[styles.page, { width: screenWidth }]}>
          <View style={styles.notesWrapper}>
            <JournalScreen />
          </View>
        </View>
      </ScrollView>

      {!shouldHideFooter ? (
        <HomeFooterNavigator
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFabPress={() => setIsNoteDrawerVisible(true)}
        />
      ) : null}

      <DraggableModal
        visible={isNoteDrawerVisible}
        onClose={() => setIsNoteDrawerVisible(false)}
        headerContent={renderHeaderContent()}
      >
        <ScrollView
          ref={noteDrawerScrollRef}
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalTextContainer}>
            <AppText
              variant="body"
              tone="primary"
              style={styles.modalDescription}
            >
              Reflect, reset, and track your journey. Every entry is a step
              forward.
            </AppText>
          </View>
          <NotesCard
            ref={notesCardRef}
            scrollViewRef={noteDrawerScrollRef}
            onSaveSuccess={() => setIsNoteDrawerVisible(false)}
          />
        </ScrollView>
      </DraggableModal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
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
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  congratsContainer: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  planCard: {
    marginBottom: SPACING.xl,
  },
  planSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    marginBottom: SPACING.sm,
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
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
  },
  saveButtonText: {
    color: BRAND_COLORS.cream,
    fontWeight: '600',
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalTextContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
});
