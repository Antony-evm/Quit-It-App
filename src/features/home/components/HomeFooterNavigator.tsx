import React, { useRef } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  Animated,
} from 'react-native';
import {
  SvgProps,
  Svg,
  Defs,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';

import { AppText } from '@/shared/components/ui';
import {
  COLOR_PALETTE,
  SPACING,
  BRAND_COLORS,
  FOOTER_LAYOUT,
} from '@/shared/theme';
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

const TAB_ICONS: Record<HomeFooterTab, React.ComponentType<SvgProps>> = {
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
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handleFabPressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleFabPressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderTab = (
    tabKey: HomeFooterTab,
    showBorderRight: boolean = false,
  ) => {
    if (tabKey === FOOTER_TABS.PLACEHOLDER) {
      return <View key={tabKey} style={styles.tab} />;
    }

    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];

    return (
      <Pressable
        key={tabKey}
        android_ripple={{ color: COLOR_PALETTE.accentMuted }}
        style={[styles.tab, showBorderRight && styles.tabBorderRight]}
        onPress={() => {
          if (tabKey !== activeTab) {
            onTabChange?.(tabKey);
          }
        }}
      >
        <Icon
          width={FOOTER_LAYOUT.ICON_SIZE}
          height={FOOTER_LAYOUT.ICON_SIZE}
          style={styles.icon}
          fill={isActive ? COLOR_PALETTE.accentPrimary : BRAND_COLORS.cream}
          fillOpacity={isActive ? 1 : 0.5}
        />
      </Pressable>
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
        <Pressable
          onPress={onFabPress}
          onPressIn={handleFabPressIn}
          onPressOut={handleFabPressOut}
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
              <Svg height="100%" width="100%" style={StyleSheet.absoluteFill}>
                <Defs>
                  <RadialGradient
                    id="grad"
                    cx="50%"
                    cy="50%"
                    rx="50%"
                    ry="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <Stop offset="0" stopColor="#3DDC97" stopOpacity="1" />
                    <Stop
                      offset="1"
                      stopColor={BRAND_COLORS.ink}
                      stopOpacity="1"
                    />
                  </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#grad)" />
              </Svg>
            </View>
            <PlusIcon
              width={FOOTER_LAYOUT.PLUS_ICON_SIZE}
              height={FOOTER_LAYOUT.PLUS_ICON_SIZE}
              fill={BRAND_COLORS.cream}
            />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: FOOTER_LAYOUT.BOTTOM_MARGIN,
    width: '100%',
    alignItems: 'center',
  },
  backgroundContainer: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderRadius: FOOTER_LAYOUT.CONTAINER_BORDER_RADIUS,
    borderWidth: FOOTER_LAYOUT.CONTAINER_BORDER_WIDTH,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '95%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xs,
  },
  tabBorderRight: {
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 12,
    overflow: 'hidden', // Ensure gradient respects border radius
    backgroundColor: BRAND_COLORS.mint,
  },
  fabGradientContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  icon: {
    // Removed marginBottom to center vertically
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
