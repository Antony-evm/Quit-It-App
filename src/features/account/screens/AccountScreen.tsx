import { useState } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Box, ScreenHeader } from '@/shared/components/ui';

import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';
import { AccountSection, SECTION_CONFIG, SECTION_ORDER } from '../constants';

export const AccountScreen = () => {
  const { t } = useTranslation();

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
      <ScrollView>
        <ScreenHeader title={t('account.title')} />

        {SECTION_ORDER.map(sectionKey => (
          <AccountSectionItem
            key={sectionKey}
            title={t(SECTION_CONFIG[sectionKey].translationKey)}
            onPress={() => setActiveSection(sectionKey)}
          />
        ))}
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
