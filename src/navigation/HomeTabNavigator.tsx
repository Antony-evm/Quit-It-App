import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  AppText,
  DraggableModal,
  ModalActionHeader,
} from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { JournalScreen } from '@/features/journal/screens/JournalScreen';
import { HomeDashboardScreen } from '@/features/home/screens/HomeDashboardScreen';
import {
  NotesCard,
  NotesCardHandle,
} from '@/features/journal/components/NotesCard';
import {
  HomeFooterNavigator,
  HomeFooterTab,
} from '@/features/home/components/HomeFooterNavigator';

export const HomeTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const noteDrawerScrollRef = useRef<ScrollView>(null);
  const notesCardRef = useRef<NotesCardHandle>(null);

  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const renderHeaderContent = () => (
    <ModalActionHeader
      onClose={() => setIsNoteDrawerVisible(false)}
      onPrimaryAction={() => notesCardRef.current?.save()}
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
    <View style={[styles.safeArea, { paddingTop: insets.top }]}>
      <View style={styles.contentContainer}>{renderContent()}</View>

      <View style={styles.footerContainer}>
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
          contentContainerStyle={styles.modalContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalTextContainer}>
            <AppText
              variant="body"
              tone="primary"
              style={styles.modalDescription}
            >
              Reflect, reset, and track your journey. Every entry is a step
              forward.
            </AppText>
          </View>
          <NotesCard
            ref={notesCardRef}
            scrollViewRef={noteDrawerScrollRef}
            onSaveSuccess={() => setIsNoteDrawerVisible(false)}
          />
        </ScrollView>
      </DraggableModal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  contentContainer: {
    flex: 1,
  },
  modalContent: {
    padding: SPACING.md,
  },
  modalTextContainer: {
    marginBottom: SPACING.xl,
    marginTop: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  modalDescription: {
    textAlign: 'center',
    lineHeight: 26,
    fontSize: 18,
  },
  footerContainer: {
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingBottom: FOOTER_LAYOUT.BOTTOM_MARGIN,
    paddingTop: FOOTER_LAYOUT.BOTTOM_MARGIN,
  },
});
