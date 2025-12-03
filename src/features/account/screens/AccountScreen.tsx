import { useState, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Box, ScreenHeader } from '@/shared/components/ui';

import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';
import { FrequencyData } from '../components/FrequencyData';
import { TriggersList } from '../components/TriggersList';
import {
  AccountSection,
  ACCOUNT_SECTIONS,
  SECTION_CONFIG,
  SECTION_ORDER,
} from '../constants';
import { useFrequencyController } from '../hooks/useFrequencyController';
import { useTriggersController } from '../hooks/useTriggersController';

export const AccountScreen = () => {
  const { t } = useTranslation();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);

  const handleClose = useCallback(() => {
    setActiveSection(null);
  }, []);

  const frequencyController = useFrequencyController({
    onSaveSuccess: handleClose,
  });

  const triggersController = useTriggersController({
    onSaveSuccess: handleClose,
  });

  const renderDrawerContent = () => {
    if (!activeSection) return null;

    // Handle TRIGGERS section specially with the controller
    if (activeSection === ACCOUNT_SECTIONS.TRIGGERS) {
      return (
        <TriggersList
          question={triggersController.question}
          initialSelection={triggersController.initialSelection}
          isLoading={triggersController.isLoading}
          error={triggersController.error}
          onSelectionChange={triggersController.onSelectionChange}
        />
      );
    }

    // Handle HABITS section specially with the controller
    if (activeSection === ACCOUNT_SECTIONS.HABITS) {
      return (
        <FrequencyData
          question={frequencyController.question}
          initialSubSelection={frequencyController.initialSubSelection}
          isLoading={frequencyController.isLoading}
          error={frequencyController.error}
          onMainSelectionChange={frequencyController.onMainSelectionChange}
          onSubSelectionChange={frequencyController.onSubSelectionChange}
        />
      );
    }

    const Component = SECTION_CONFIG[activeSection].component;
    if (!Component) return null;
    return <Component />;
  };

  const getDrawerTitle = () => {
    if (!activeSection) return '';
    return t(SECTION_CONFIG[activeSection].translationKey);
  };

  const getPrimaryAction = useMemo(() => {
    if (
      activeSection === ACCOUNT_SECTIONS.TRIGGERS &&
      triggersController.canSave
    ) {
      return triggersController.save;
    }
    if (
      activeSection === ACCOUNT_SECTIONS.HABITS &&
      frequencyController.canSave
    ) {
      return frequencyController.save;
    }
    return undefined;
  }, [
    activeSection,
    triggersController.canSave,
    triggersController.save,
    frequencyController.canSave,
    frequencyController.save,
  ]);

  const getPrimaryLabel = useMemo(() => {
    if (
      activeSection === ACCOUNT_SECTIONS.TRIGGERS &&
      triggersController.canSave
    ) {
      return t('common.save');
    }
    if (
      activeSection === ACCOUNT_SECTIONS.HABITS &&
      frequencyController.canSave
    ) {
      return t('common.save');
    }
    return undefined;
  }, [
    activeSection,
    triggersController.canSave,
    frequencyController.canSave,
    t,
  ]);

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
        onClose={handleClose}
        title={getDrawerTitle()}
        onPrimaryAction={getPrimaryAction}
        primaryLabel={getPrimaryLabel}
      >
        {renderDrawerContent()}
      </BottomDrawer>
    </Box>
  );
};
