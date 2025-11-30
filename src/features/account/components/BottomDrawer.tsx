import React from 'react';
import { TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText, DraggableModal, AppIcon, Box } from '@/shared/components/ui';
import CancelSvg from '@/assets/cancel.svg';

type BottomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export const BottomDrawer = ({
  visible,
  onClose,
  title,
  children,
}: BottomDrawerProps) => {
  const { t } = useTranslation();

  const headerContent = (
    <TouchableOpacity
      onPress={onClose}
      accessibilityLabel={t('common.close')}
      accessibilityRole="button"
    >
      <AppIcon icon={CancelSvg} />
    </TouchableOpacity>
  );

  return (
    <DraggableModal
      visible={visible}
      onClose={onClose}
      headerContent={headerContent}
    >
      <Box variant="drawerTitle">
        <AppText variant="heading" tone="primary">
          {title}
        </AppText>
      </Box>
      <ScrollView style={{ flex: 1 }}>
        <Box p="lg">{children}</Box>
      </ScrollView>
    </DraggableModal>
  );
};
