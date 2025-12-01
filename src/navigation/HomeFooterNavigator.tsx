import React from 'react';
import { StyleProp, Animated, ViewStyle, View, StyleSheet } from 'react-native';
import { SvgProps } from 'react-native-svg';

import { AppPressable, AppIcon, Box } from '@/shared/components/ui';
import {
  SYSTEM,
  FOOTER_LAYOUT,
  ICON_SIZES,
  BACKGROUND,
  SPACING,
  SHADOWS,
} from '@/shared/theme';
import { FabGradient } from './FabGradient';
import { useFabAnimation } from './useFabAnimation';
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

const PlaceholderIcon = (_props: SvgProps) => (
  <View style={styles.placeholderIcon} />
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
      return <View key={tabKey} style={styles.placeholderTab} />;
    }

    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];

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
          variant="inverse"
          fillOpacity={isActive ? 1 : 0.5}
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
        {renderTab(FOOTER_TABS.PLACEHOLDER, false)}
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
  },
  footerBackground: {
    flexDirection: 'row',
    backgroundColor: BACKGROUND.primary,
    borderRadius: FOOTER_LAYOUT.CONTAINER_BORDER_RADIUS,
    borderWidth: FOOTER_LAYOUT.CONTAINER_BORDER_WIDTH,
    borderColor: SYSTEM.border,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
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
  },
  fabGradient: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  placeholderIcon: {
    width: ICON_SIZES.medium,
    height: ICON_SIZES.medium,
  },
  placeholderTab: {
    flex: 1,
  },
  tabWithBorder: {
    borderRightWidth: 1,
    borderRightColor: SYSTEM.border,
  },
});
