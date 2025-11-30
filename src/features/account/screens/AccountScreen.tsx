import { useState } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Box, ScreenHeader, StatusMessage } from '@/shared/components/ui';
import { COLOR_PALETTE } from '@/shared/theme';

import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';
import { AccountSection, SECTION_CONFIG, SECTION_ORDER } from '../constants';
import { useQuitDate } from '../hooks/useQuitDate';

export const AccountScreen = () => {
  const { t } = useTranslation();
  const { refresh, isRefetching, error } = useQuitDate();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  const renderDrawerContent = () => {
    if (!activeSection) return null;
    const Component = SECTION_CONFIG[activeSection].component;
    return <Component />;
  };

  const getDrawerTitle = () => {
    if (!activeSection) return '';
    return t(SECTION_CONFIG[activeSection].translationKey);
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

        {SECTION_ORDER.map(sectionKey => (
          <AccountSectionItem
            key={sectionKey}
            title={t(SECTION_CONFIG[sectionKey].translationKey)}
            onPress={() => setActiveSection(sectionKey)}
          />
        ))}

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
