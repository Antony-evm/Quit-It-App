import React from 'react';
import { StyleProp, Animated, ViewStyle, View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { AppPressable, AppIcon, Box } from '@/shared/components/ui';
import {
  SYSTEM,
  TEXT,
  FOOTER_LAYOUT,
  BORDER_RADIUS,
  BORDER_WIDTH,
  BACKGROUND,
  SPACING,
  SHADOWS,
  DEVICE_WIDTH,
} from '@/shared/theme';
import { FabGradient } from './FabGradient';
import { useFabAnimation } from './useFabAnimation';
import AccountIcon from '@/assets/account.svg';
import HomeIcon from '@/assets/home.svg';
import ClipboardIcon from '@/assets/clipboard.svg';
import MedalIcon from '@/assets/unlock.svg';
import PlusIcon from '@/assets/plus.svg';

export type HomeFooterTab = 'account' | 'home' | 'journal' | 'milestones';

export const FOOTER_TABS = {
  ACCOUNT: 'account' as HomeFooterTab,
  HOME: 'home' as HomeFooterTab,
  JOURNAL: 'journal' as HomeFooterTab,
  MILESTONES: 'milestones' as HomeFooterTab,
};

const TAB_ICONS: Record<HomeFooterTab, React.FC<SvgProps>> = {
  account: AccountIcon,
  home: HomeIcon,
  journal: ClipboardIcon,
  milestones: MedalIcon,
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
    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];
    const iconColor = isActive ? SYSTEM.brand : TEXT.primary;

    return (
      <AppPressable
        key={tabKey}
        variant="tab"
        style={showBorderRight && styles.tabWithBorder}
        android_ripple={{ color: SYSTEM.accentMuted }}
        onPress={() => {
          if (tabKey !== activeTab) {
            onTabChange?.(tabKey);
          }
        }}
      >
        <AppIcon
          icon={Icon}
          stroke={iconColor}
          strokeOpacity={isActive ? 1 : 0.7}
        />
      </AppPressable>
    );
  };

  return (
    <View style={[styles.footerMain, style]}>
      <View style={styles.footerBackground}>
        {renderTab(FOOTER_TABS.ACCOUNT, true)}
        {renderTab(FOOTER_TABS.HOME, false)}
        <View style={styles.fabPlaceholder} />
        {renderTab(FOOTER_TABS.JOURNAL, true)}
        {renderTab(FOOTER_TABS.MILESTONES, false)}
      </View>

      <View style={styles.fabContainer}>
        <AppPressable
          onPress={onFabPress}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
          activeOpacity={1}
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
            <View style={styles.fabInnerRing} pointerEvents="none" />
            <View style={styles.fabGradient}>
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
  footerMain: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: FOOTER_LAYOUT.BOTTOM_MARGIN,
  },
  footerBackground: {
    flexDirection: 'row',
    backgroundColor: BACKGROUND.primary,
    borderRadius: BORDER_RADIUS.medium,
    borderWidth: BORDER_WIDTH.md,
    borderLeftWidth: BORDER_WIDTH.lg,
    borderColor: SYSTEM.border,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: DEVICE_WIDTH - SPACING.xxl * 2,
    ...SHADOWS.lg,
  },
  fabPlaceholder: {
    width: FOOTER_LAYOUT.FAB_SIZE,
    height: 1,
  },
  fabContainer: {
    position: 'absolute',
    top: FOOTER_LAYOUT.FAB_OFFSET,
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
    borderColor: SYSTEM.border,
    overflow: 'hidden',
    backgroundColor: SYSTEM.brand,
    ...SHADOWS.xxl,
    shadowColor: SYSTEM.brand,
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabInnerRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: FOOTER_LAYOUT.FAB_BORDER_RADIUS,
    borderWidth: 2,
    borderColor: TEXT.inverse,
    zIndex: 1,
  },
  fabGradient: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
  tabWithBorder: {
    borderRightWidth: 1,
    borderRightColor: SYSTEM.border,
  },
});
