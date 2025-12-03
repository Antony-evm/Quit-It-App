import React, { useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  AppText,
  DraggableModal,
  Box,
  ModalActionHeader,
} from '@/shared/components/ui';

type BottomDrawerProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onPrimaryAction?: () => void;
  primaryLabel?: string;
};

export const BottomDrawer = ({
  visible,
  onClose,
  title,
  children,
  onPrimaryAction,
  primaryLabel,
}: BottomDrawerProps) => {
  const { t } = useTranslation();

  const headerContent = useMemo(
    () => (
      <ModalActionHeader
        onClose={onClose}
        onPrimaryAction={onPrimaryAction}
        primaryLabel={primaryLabel}
      />
    ),
    [onClose, onPrimaryAction, primaryLabel],
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
