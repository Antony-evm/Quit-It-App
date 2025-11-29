import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING, BORDER_RADIUS } from '@/shared/theme';

export type HomeStat = {
  label: string;
  value: string;
  icon?: ReactNode;
  accentColor?: string;
  tagLabel?: string;
  tagBackgroundColor?: string;
  bottomLabel?: string;
};

type HomeStatsRowProps = {
  stats: HomeStat[];
  style?: StyleProp<ViewStyle>;
};

export const HomeStatsRow = ({ stats, style }: HomeStatsRowProps) => (
  <View style={[styles.container, style]}>
    {stats.map((stat, index) => {
      return (
        <View
          key={stat.label}
          style={[
            styles.statCard,
            index > 0 && styles.statCardSpacing,
            {
              borderLeftColor: stat.accentColor ?? COLOR_PALETTE.accentMuted,
              borderLeftWidth: 4,
            },
          ]}
        >
          <View style={styles.contentRow}>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    stat.tagBackgroundColor ?? COLOR_PALETTE.backgroundMuted,
                },
              ]}
            >
              <AppText style={styles.tagText}>
                {stat.tagLabel ?? stat.label}
              </AppText>
            </View>
            <AppText style={styles.text}>
              {stat.bottomLabel}: {stat.value}
            </AppText>
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  statCard: {
    borderWidth: 2,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
  },
  statCardSpacing: {
    marginTop: SPACING.md,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tag: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
    marginRight: SPACING.sm,
  },
  tagText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: COLOR_PALETTE.textPrimary,
    fontWeight: '600',
  },
});
