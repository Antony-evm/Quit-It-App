import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle, Animated } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { AppText, AppPressable, AppIcon } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, FOOTER_LAYOUT } from '@/shared/theme';
import { FabGradient } from './FabGradient';
import { useFabAnimation } from '../hooks/useFabAnimation';
import AccountIcon from '@/assets/account.svg';
import HomeIcon from '@/assets/home.svg';
import ClipboardIcon from '@/assets/clipboard.svg';
import PlusIcon from '@/assets/plus.svg';

export type HomeFooterTab = 'account' | 'home' | 'journal' | 'placeholder';

export const FOOTER_TABS = {
  ACCOUNT: 'account' as HomeFooterTab,
  HOME: 'home' as HomeFooterTab,
  JOURNAL: 'journal' as HomeFooterTab,
  PLACEHOLDER: 'placeholder' as HomeFooterTab,
};

const PlaceholderIcon = (props: SvgProps) => (
  <View style={{ width: 24, height: 24 }} />
);

const TAB_ICONS: Record<HomeFooterTab, React.FC<SvgProps>> = {
  account: AccountIcon,
  home: HomeIcon,
  journal: ClipboardIcon,
  placeholder: PlaceholderIcon,
};

type HomeFooterNavigatorProps = {
  activeTab: HomeFooterTab;
  onTabChange?: (tab: HomeFooterTab) => void;
  onFabPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const HomeFooterNavigator = ({
  activeTab,
  onTabChange,
  onFabPress,
  style,
}: HomeFooterNavigatorProps) => {
  const { scaleAnim, opacityAnim, handleFabPressIn, handleFabPressOut } =
    useFabAnimation();

  const renderTab = (
    tabKey: HomeFooterTab,
    showBorderRight: boolean = false,
  ) => {
    if (tabKey === FOOTER_TABS.PLACEHOLDER) {
      return <View key={tabKey} style={{ flex: 1 }} />;
    }

    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];

    return (
      <AppPressable
        key={tabKey}
        variant="tab"
        separator={showBorderRight}
        android_ripple={{ color: COLOR_PALETTE.accentMuted }}
        onPress={() => {
          if (tabKey !== activeTab) {
            onTabChange?.(tabKey);
          }
        }}
      >
        <AppIcon
          icon={Icon}
          variant="inverse"
          fillOpacity={isActive ? 1 : 0.5}
        />
      </AppPressable>
    );
  };

  return (
    <View style={[styles.mainContainer, style]}>
      <View style={styles.backgroundContainer}>
        {renderTab(FOOTER_TABS.ACCOUNT, true)}
        {renderTab(FOOTER_TABS.HOME, false)}
        <View style={styles.fabPlaceholder} />

        {renderTab(FOOTER_TABS.JOURNAL, true)}
        {renderTab(FOOTER_TABS.PLACEHOLDER, false)}
      </View>

      <View style={styles.fabAbsoluteContainer}>
        <AppPressable
          onPress={onFabPress}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          interaction="none"
        >
          <Animated.View
            style={[
              styles.fab,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <View style={styles.fabGradientContainer}>
              <FabGradient />
            </View>
            <AppIcon icon={PlusIcon} variant="fab" />
          </Animated.View>
        </AppPressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // Removed absolute positioning to allow flex layout in parent
    width: '100%',
    alignItems: 'center',
  },
  backgroundContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: FOOTER_LAYOUT.CONTAINER_BORDER_RADIUS,
    borderWidth: FOOTER_LAYOUT.CONTAINER_BORDER_WIDTH,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  fabPlaceholder: {
    width: FOOTER_LAYOUT.FAB_SIZE, // Approximate width of FAB + margins
    height: 1,
  },
  fabAbsoluteContainer: {
    position: 'absolute',
    top: FOOTER_LAYOUT.FAB_OFFSET, // Stick out more
    alignSelf: 'center',
    zIndex: 10,
  },
  fab: {
    width: FOOTER_LAYOUT.FAB_SIZE,
    height: FOOTER_LAYOUT.FAB_SIZE,
    borderRadius: FOOTER_LAYOUT.FAB_BORDER_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: FOOTER_LAYOUT.FAB_BORDER_WIDTH,
    borderColor: COLOR_PALETTE.borderDefault,
    shadowColor: COLOR_PALETTE.shadowDefault,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 12,
    overflow: 'hidden', // Ensure gradient respects border radius
    backgroundColor: COLOR_PALETTE.brandPrimary,
  },
  fabGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  indicatorWrapper: {
    height: 4,
    justifyContent: 'center',
    marginTop: 4,
  },
  indicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
});
