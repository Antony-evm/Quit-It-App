import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { AppText } from '../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';

export type HomeFooterTab = 'home' | 'account';

const TABS: { key: HomeFooterTab; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'account', label: 'Account' },
];

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
          <View style={[styles.iconStub, isActive && styles.iconStubActive]} />
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
  iconStub: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    marginBottom: SPACING.xs,
  },
  iconStubActive: {
    backgroundColor: COLOR_PALETTE.accentPrimary,
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
