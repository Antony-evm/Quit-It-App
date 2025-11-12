import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

export type HomeStat = {
  label: string;
  value: string;
  icon?: ReactNode;
  accentColor?: string;
};

type HomeStatsRowProps = {
  stats: HomeStat[];
  style?: StyleProp<ViewStyle>;
};

export const HomeStatsRow = ({ stats, style }: HomeStatsRowProps) => (
  <View style={[styles.container, style]}>
    {stats.map((stat, index) => {
      const Icon = stat.icon ?? <View style={styles.iconStub} />;

      return (
        <View key={stat.label} style={[styles.statCard, index > 0 && styles.statCardSpacing]}>
          <View
            style={[
              styles.iconWrapper,
              { backgroundColor: stat.accentColor ?? COLOR_PALETTE.accentMuted },
            ]}
          >
            {Icon}
          </View>
          <AppText variant="caption" tone="secondary">
            {stat.label}
          </AppText>
          <AppText variant="heading" style={styles.valueText}>
            {stat.value}
          </AppText>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 20,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  statCardSpacing: {
    marginLeft: SPACING.md,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  iconStub: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
  valueText: {
    marginTop: SPACING.xs,
  },
});
