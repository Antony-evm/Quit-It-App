import { useState, useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Box, ScreenHeader } from '@/shared/components/ui';

import { AccountSectionItem } from '../components/AccountSectionItem';
import { BottomDrawer } from '../components/BottomDrawer';
import { FrequencyDataContainer } from '../components/FrequencyDataContainer';
import { TriggersListContainer } from '../components/TriggersListContainer';
import {
  AccountSection,
  ACCOUNT_SECTIONS,
  SECTION_CONFIG,
  SECTION_ORDER,
} from '../constants';

type ControllerState = {
  canSave: boolean;
  save: () => Promise<void>;
};

export const AccountScreen = () => {
  const { t } = useTranslation();

  const [activeSection, setActiveSection] = useState<AccountSection>(null);
  const [triggersController, setTriggersController] =
    useState<ControllerState | null>(null);
  const [frequencyController, setFrequencyController] =
    useState<ControllerState | null>(null);

  const handleClose = useCallback(() => {
    setActiveSection(null);
    // Reset controller states when closing
    setTriggersController(null);
    setFrequencyController(null);
  }, []);

  const handleTriggersControllerReady = useCallback(
    (controller: ControllerState) => {
      setTriggersController(controller);
    },
    [],
  );

  const handleFrequencyControllerReady = useCallback(
    (controller: ControllerState) => {
      setFrequencyController(controller);
    },
    [],
  );

  const renderDrawerContent = () => {
    if (!activeSection) return null;

    // Handle TRIGGERS section - lazy loaded
    if (activeSection === ACCOUNT_SECTIONS.TRIGGERS) {
      return (
        <TriggersListContainer
          onSaveSuccess={handleClose}
          onControllerReady={handleTriggersControllerReady}
        />
      );
    }

    // Handle HABITS section - lazy loaded
    if (activeSection === ACCOUNT_SECTIONS.HABITS) {
      return (
        <FrequencyDataContainer
          onSaveSuccess={handleClose}
          onControllerReady={handleFrequencyControllerReady}
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

  const getDrawerSubtitle = () => {
    if (!activeSection) return '';
    return t(SECTION_CONFIG[activeSection].descriptionKey);
  };

  const getPrimaryAction = () => {
    if (
      activeSection === ACCOUNT_SECTIONS.TRIGGERS &&
      triggersController?.canSave
    ) {
      return triggersController.save;
    }
    if (
      activeSection === ACCOUNT_SECTIONS.HABITS &&
      frequencyController?.canSave
    ) {
      return frequencyController.save;
    }
    return undefined;
  };

  const getPrimaryLabel = () => {
    if (
      activeSection === ACCOUNT_SECTIONS.TRIGGERS &&
      triggersController?.canSave
    ) {
      return t('common.save');
    }
    if (
      activeSection === ACCOUNT_SECTIONS.HABITS &&
      frequencyController?.canSave
    ) {
      return t('common.save');
    }
    return undefined;
  };

  return (
    <Box variant="default">
      <ScrollView>
        <ScreenHeader
          title={t('account.title')}
          subtitle={t('account.subtitle')}
        />

        {SECTION_ORDER.map(sectionKey => (
          <AccountSectionItem
            key={sectionKey}
            title={t(SECTION_CONFIG[sectionKey].translationKey)}
            description={t(SECTION_CONFIG[sectionKey].descriptionKey)}
            onPress={() => setActiveSection(sectionKey)}
          />
        ))}
      </ScrollView>

      <BottomDrawer
        visible={!!activeSection}
        onClose={handleClose}
        title={getDrawerTitle()}
        subtitle={getDrawerSubtitle()}
        onPrimaryAction={getPrimaryAction()}
        primaryLabel={getPrimaryLabel()}
      >
        {renderDrawerContent()}
      </BottomDrawer>
    </Box>
  );
};
