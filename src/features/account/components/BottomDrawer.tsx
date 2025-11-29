import React from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { SPACING, COLOR_PALETTE } from '@/shared/theme';
import { AppText, DraggableModal, AppIcon } from '@/shared/components/ui';
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
  const headerContent = (
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <AppIcon icon={CancelSvg} variant="default" />
    </TouchableOpacity>
  );

  return (
    <DraggableModal
      visible={visible}
      onClose={onClose}
      headerContent={headerContent}
      headerStyle={styles.headerContainer}
      indicatorStyle={styles.indicator}
    >
      <View style={styles.titleContainer}>
        <AppText variant="heading" tone="primary">
          {title}
        </AppText>
      </View>
      <ScrollView style={styles.content}>{children}</ScrollView>
    </DraggableModal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 10,
    zIndex: 10,
  },
  indicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  titleContainer: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
    zIndex: 5,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
  },
});
