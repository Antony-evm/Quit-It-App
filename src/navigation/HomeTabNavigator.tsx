import React, { useState, useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  Box,
  DraggableModal,
  ModalActionHeader,
} from '@/shared/components/ui';
import { BACKGROUND, FOOTER_LAYOUT } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { JournalScreen } from '@/features/journal/screens/JournalScreen';
import { HomeDashboardScreen } from '@/features/home/screens/HomeDashboardScreen';
import { NotesCard } from '@/features/journal/components/NotesCard';
import { useNotesCardController } from '@/features/journal/hooks/useNotesCardController';
import { HomeFooterNavigator, HomeFooterTab } from './HomeFooterNavigator';

export const HomeTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const noteDrawerScrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  // Use the controller hook for create mode
  const createController = useNotesCardController({
    scrollViewRef: noteDrawerScrollRef,
    onSaveSuccess: () => setIsNoteDrawerVisible(false),
  });

  const renderHeaderContent = () => (
    <ModalActionHeader
      onClose={() => setIsNoteDrawerVisible(false)}
      onPrimaryAction={createController.save}
      primaryLabel="Save"
    />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountScreen />;
      case 'home':
        return <HomeDashboardScreen />;
      case 'journal':
        return <JournalScreen />;
      default:
        return <HomeDashboardScreen />;
    }
  };

  return (
    <Box flex={1} bg="muted" style={{ paddingTop: insets.top }}>
      <Box flex={1}>{renderContent()}</Box>

      <View style={styles.footerWrapper}>
        <HomeFooterNavigator
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onFabPress={() => setIsNoteDrawerVisible(true)}
        />
      </View>

      <DraggableModal
        visible={isNoteDrawerVisible}
        onClose={() => setIsNoteDrawerVisible(false)}
        headerContent={renderHeaderContent()}
      >
        <ScrollView
          ref={noteDrawerScrollRef}
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <Box variant="modalTextContainer">
            <AppText variant="body" tone="primary" centered>
              Reflect, reset, and track your journey. Every entry is a step
              forward.
            </AppText>
          </Box>
          {createController.isReady && (
            <NotesCard
              trackingTypes={createController.trackingTypes}
              selectedTrackingTypeId={createController.selectedTrackingTypeId}
              selectedDateTime={createController.selectedDateTime}
              notes={createController.notes}
              maxChars={createController.maxChars}
              accentColor={createController.accentColor}
              isLoading={createController.isLoading}
              onTrackingTypeSelect={createController.onTrackingTypeSelect}
              onDateTimeChange={createController.onDateTimeChange}
              onNotesChange={createController.onNotesChange}
              onNotesFocus={createController.onNotesFocus}
              scrollViewRef={noteDrawerScrollRef}
            />
          )}
        </ScrollView>
      </DraggableModal>
    </Box>
  );
};

const styles = StyleSheet.create({
  footerWrapper: {
    backgroundColor: BACKGROUND.muted,
    paddingBottom: FOOTER_LAYOUT.BOTTOM_MARGIN,
    paddingTop: FOOTER_LAYOUT.BOTTOM_MARGIN,
  },
});
