import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  ScrollView,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText, DraggableModal } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { JournalScreen } from './JournalScreen';
import { HomeDashboardScreen } from './HomeDashboardScreen';
import { NotesCard, NotesCardHandle } from '../components/NotesCard';
import {
  HomeFooterNavigator,
  HomeFooterTab,
} from '../components/HomeFooterNavigator';
import CancelIcon from '@/assets/cancel.svg';

export const HomeTabNavigator = () => {
  const insets = useSafeAreaInsets();
  const noteDrawerScrollRef = useRef<ScrollView>(null);
  const notesCardRef = useRef<NotesCardHandle>(null);

  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const renderHeaderContent = () => (
    <View style={styles.modalHeaderContent}>
      <Pressable
        onPress={() => setIsNoteDrawerVisible(false)}
        style={({ pressed }) => [
          styles.headerButton,
          pressed && { opacity: 0.7 },
        ]}
        hitSlop={10}
      >
        <CancelIcon width={24} height={24} color={COLOR_PALETTE.textPrimary} />
      </Pressable>

      <Pressable
        onPress={() => notesCardRef.current?.save()}
        style={styles.headerButton}
        hitSlop={10}
      >
        {({ pressed }) => (
          <AppText
            variant="body"
            style={[styles.saveButtonText, pressed && { opacity: 0.7 }]}
          >
            Save
          </AppText>
        )}
      </Pressable>
    </View>
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
          style={styles.footer}
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
  modalHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: SPACING.xs,
  },
  saveButtonText: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
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
  footer: {
    // Removed relative positioning as it's now part of the flex layout
  },
});
