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

export type HomeFooterTab = 'account' | 'home' | 'notes';

const TABS: { key: HomeFooterTab; label: string }[] = [
  { key: 'account', label: 'Account' },
  { key: 'home', label: 'Home' },
  { key: 'notes', label: 'Notes' },
];

const TAB_ICONS: Record<HomeFooterTab, React.ComponentType<SvgProps>> = {
  account: AccountIcon,
  home: HomeIcon,
  notes: ClipboardIcon,
};

type HomeFooterNavigatorProps = {
  activeTab: HomeFooterTab;
  onTabChange?: (tab: HomeFooterTab) => void;
  style?: StyleProp<ViewStyle>;
};

export const HomeFooterNavigator = ({
  activeTab,
  onTabChange,
  style,
}: HomeFooterNavigatorProps) => (
  <View style={[styles.container, style]}>
    {TABS.map(tab => {
      const isActive = tab.key === activeTab;
      const Icon = TAB_ICONS[tab.key];

      return (
        <Pressable
          key={tab.key}
          android_ripple={{ color: COLOR_PALETTE.accentMuted }}
          style={styles.tab}
          onPress={() => {
            if (tab.key !== activeTab) {
              onTabChange?.(tab.key);
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
            {tab.label}
          </AppText>
          <View style={styles.indicatorWrapper}>
            {isActive ? <View style={styles.indicator} /> : null}
          </View>
        </Pressable>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderTopWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    marginBottom: SPACING.xs,
  },
  label: {
    color: COLOR_PALETTE.textSecondary,
  },
  labelActive: {
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
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
