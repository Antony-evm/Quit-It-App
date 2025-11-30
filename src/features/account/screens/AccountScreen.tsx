import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const { user } = useAuth();
  const { handleRefresh, isRefetching, error } = useQuitDateLogic();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  useSmokingTriggersQuestion();
  useSmokingFrequencyQuestion();

  const renderDrawerContent = () => {
    switch (activeSection) {
      case 'details':
        return (
          <Box mb="lg">
            <IconTextCard
              icon={EmailSvg}
              text={user?.email ?? t('account.emailPlaceholder')}
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
        return t('account.sections.details');
      case 'plan':
        return t('account.sections.plan');
      case 'triggers':
        return t('account.sections.triggers');
      case 'habits':
        return t('account.sections.habits');
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
          title={t('account.title')}
          marginBottom={SPACING.xl}
          paddingHorizontal={0}
        />

        <AccountSectionItem
          title={t('account.sections.details')}
          onPress={() => setActiveSection('details')}
        />
        <AccountSectionItem
          title={t('account.sections.plan')}
          onPress={() => setActiveSection('plan')}
        />
        <AccountSectionItem
          title={t('account.sections.triggers')}
          onPress={() => setActiveSection('triggers')}
        />
        <AccountSectionItem
          title={t('account.sections.habits')}
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
  scrollContent: {},
  globalError: {
    color: COLOR_PALETTE.systemError,
    marginBottom: SPACING.lg,
  },
});
