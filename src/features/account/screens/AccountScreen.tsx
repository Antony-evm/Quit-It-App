import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';

import {
  AppText,
  Box,
  ScreenHeader,
  IconTextCard,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import EmailSvg from '@/assets/email.svg';

import { useAuth } from '@/shared/auth';
import { QuittingPlanDetails } from '@/features/questionnaire/components/QuittingPlanDetails';
import { TriggersList } from '@/features/questionnaire/components/TriggersList';
import { FrequencyData } from '@/features/questionnaire/components/FrequencyData';
import { useSmokingTriggersQuestion } from '@/features/questionnaire/hooks/useSmokingTriggersQuestion';
import { useSmokingFrequencyQuestion } from '@/features/questionnaire/hooks/useSmokingFrequencyQuestion';
import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';
import { useQuitDateLogic } from '../hooks/useQuitDateLogic';

type AccountSection = 'details' | 'plan' | 'triggers' | 'habits' | null;

export const AccountScreen = () => {
  const { user } = useAuth();
  const { handleRefresh, isRefetching, error } = useQuitDateLogic();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  // Pre-fetch the smoking triggers question
  useSmokingTriggersQuestion();
  useSmokingFrequencyQuestion();

  const renderDrawerContent = () => {
    switch (activeSection) {
      case 'details':
        return (
          <Box mb="lg">
            <IconTextCard
              icon={EmailSvg}
              text={user?.email ?? 'Not available'}
            />
          </Box>
        );
      case 'plan':
        return <QuittingPlanDetails />;
      case 'triggers':
        return <TriggersList />;
      case 'habits':
        return <FrequencyData />;
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
    <Box flex={1}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            tintColor={COLOR_PALETTE.textPrimary}
            colors={[COLOR_PALETTE.textPrimary]}
            progressBackgroundColor={COLOR_PALETTE.backgroundCream}
            refreshing={isRefetching}
            onRefresh={handleRefresh}
          />
        }
      >
        <ScreenHeader
          title="Your Quit It Profile"
          marginBottom={SPACING.xl}
          paddingHorizontal={0}
        />

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
    </Box>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl + FOOTER_LAYOUT.FAB_SIZE / 2,
  },
  globalError: {
    color: COLOR_PALETTE.systemError,
    marginBottom: SPACING.lg,
  },
});
