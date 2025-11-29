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
          <View style={styles.tagContainer}>
            <View
              style={[
                styles.tag,
                {
                  backgroundColor:
                    stat.tagBackgroundColor ?? COLOR_PALETTE.backgroundMuted,
                },
              ]}
            >
              <AppText variant="caption" style={styles.tagText}>
                {stat.tagLabel ?? stat.label}
              </AppText>
            </View>
            {stat.bottomLabel && (
              <AppText
                variant="caption"
                tone="primary"
                style={styles.bottomLabelText}
              >
                {stat.bottomLabel}
              </AppText>
            )}
          </View>
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
    borderRadius: BORDER_RADIUS.medium,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    justifyContent: 'space-between',
  },
  statCardSpacing: {
    marginLeft: SPACING.md,
  },
  tagContainer: {
    marginBottom: SPACING.sm,
    alignItems: 'flex-start',
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.full,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  bottomLabelText: {
    marginTop: 4,
    fontSize: 12,
    paddingLeft: SPACING.sm,
  },
  valueText: {
    marginTop: SPACING.xs,
  },
});
