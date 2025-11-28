import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { SvgProps } from 'react-native-svg';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BRAND_COLORS } from '@/shared/theme';
import AccountIcon from '@/assets/account.svg';
import HomeIcon from '@/assets/home.svg';
import ClipboardIcon from '@/assets/clipboard.svg';
import PlusIcon from '@/assets/plus.svg';

export type HomeFooterTab = 'account' | 'home' | 'journal';

const TAB_ICONS: Record<HomeFooterTab, React.ComponentType<SvgProps>> = {
  account: AccountIcon,
  home: HomeIcon,
  journal: ClipboardIcon,
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
  const renderTab = (tabKey: HomeFooterTab, label: string) => {
    const isActive = tabKey === activeTab;
    const Icon = TAB_ICONS[tabKey];

    return (
      <Pressable
        key={tabKey}
        android_ripple={{ color: COLOR_PALETTE.accentMuted }}
        style={styles.tab}
        onPress={() => {
          if (tabKey !== activeTab) {
            onTabChange?.(tabKey);
          }
        }}
      >
        <Icon
          width={28}
          height={28}
          style={styles.icon}
          fill={BRAND_COLORS.cream}
        />
        <AppText
          variant="caption"
          style={[styles.label, isActive && styles.labelActive]}
        >
          {label}
        </AppText>
        <View style={styles.indicatorWrapper}>
          {isActive ? <View style={styles.indicator} /> : null}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {renderTab('account', 'Account')}
      {renderTab('home', 'Home')}

      <View style={styles.fabContainer}>
        <Pressable
          style={styles.fab}
          onPress={onFabPress}
          android_ripple={{
            color: COLOR_PALETTE.accentMuted,
            borderless: true,
          }}
        >
          <PlusIcon width={24} height={24} fill={BRAND_COLORS.cream} />
        </Pressable>
      </View>

      {renderTab('journal', 'Journal')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderTopWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  fabContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: BRAND_COLORS.ink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BRAND_COLORS.cream,
  },
  icon: {
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLOR_PALETTE.textPrimary,
  },
  labelActive: {
    color: COLOR_PALETTE.textPrimary,
  },
  indicatorWrapper: {
    height: 6,
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },
  indicator: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
});
