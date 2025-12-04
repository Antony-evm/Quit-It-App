import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Box } from '@/shared/components/ui';
import { BACKGROUND, FOOTER_LAYOUT } from '@/shared/theme';
import { AccountScreen } from '@/features/account/screens/AccountScreen';
import { JournalScreen } from '@/features/journal/screens/JournalScreen';
import { HomeDashboardScreen } from '@/features/home/screens/HomeDashboardScreen';
import { RewardsScreen } from '@/features/rewards/screens/RewardsScreen';
import { HomeFooterNavigator, HomeFooterTab } from './HomeFooterNavigator';
import { CreateNoteModal } from './CreateNoteModal';

export const HomeTabNavigator = () => {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<HomeFooterTab>('home');
  const [isNoteDrawerVisible, setIsNoteDrawerVisible] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'account':
        return <AccountScreen />;
      case 'home':
        return <HomeDashboardScreen />;
      case 'journal':
        return <JournalScreen />;
      case 'rewards':
        return <RewardsScreen />;
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

      <CreateNoteModal
        visible={isNoteDrawerVisible}
        onClose={() => setIsNoteDrawerVisible(false)}
      />
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
