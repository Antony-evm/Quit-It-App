import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';

import { AppText, Box } from '@/shared/components/ui';
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
  <Box flexDirection="column" style={style}>
    {stats.map((stat, index) => {
      return (
        <Box
          key={stat.label}
          bg="backgroundPrimary"
          borderRadius="medium"
          py="md"
          px="md"
          style={[
            styles.statCard,
            index > 0 && styles.statCardSpacing,
            {
              borderLeftColor: stat.accentColor ?? COLOR_PALETTE.accentMuted,
              borderLeftWidth: 4,
            },
          ]}
        >
          <Box flexDirection="row" alignItems="center">
            <Box
              px="md"
              py="xs"
              borderRadius="full"
              mr="sm"
              style={{
                backgroundColor:
                  stat.tagBackgroundColor ?? COLOR_PALETTE.backgroundMuted,
              }}
            >
              <AppText style={styles.tagText}>
                {stat.tagLabel ?? stat.label}
              </AppText>
            </Box>
            <AppText style={styles.text}>
              {stat.bottomLabel}: {stat.value}
            </AppText>
          </Box>
        </Box>
      );
    })}
  </Box>
);

const styles = StyleSheet.create({
  statCard: {
    borderWidth: 2,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  statCardSpacing: {
    marginTop: SPACING.md,
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
