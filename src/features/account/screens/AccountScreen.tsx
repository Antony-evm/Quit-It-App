import { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Box, ScreenHeader, StatusMessage } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

import { QuittingPlanDetails } from '@/features/questionnaire/components/QuittingPlanDetails';
import { TriggersList } from '@/features/questionnaire/components/TriggersList';
import { FrequencyData } from '@/features/questionnaire/components/FrequencyData';
import { AccountSectionItem } from '../components/AccountSectionItem';
import { AccountDetails } from '../components/AccountDetails';
import { BottomDrawer } from '../components/BottomDrawer';
import { useQuitDate } from '../hooks/useQuitDate';

type AccountSection = 'details' | 'plan' | 'triggers' | 'habits' | null;

export const AccountScreen = () => {
  const { t } = useTranslation();
  const { refresh, isRefetching, error } = useQuitDate();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  const renderDrawerContent = () => {
    switch (activeSection) {
      case 'details':
        return <AccountDetails />;
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
    <Box variant="default">
      <ScrollView
        refreshControl={
          <RefreshControl
            tintColor={COLOR_PALETTE.textPrimary}
            colors={[COLOR_PALETTE.textPrimary]}
            progressBackgroundColor={COLOR_PALETTE.backgroundCream}
            refreshing={isRefetching}
            onRefresh={refresh}
          />
        }
      >
        <ScreenHeader title={t('account.title')} />

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

        {error ? <StatusMessage type="error" message={error} /> : null}
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
