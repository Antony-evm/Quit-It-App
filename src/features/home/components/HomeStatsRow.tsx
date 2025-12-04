import React, { memo, useMemo, ReactNode } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

import { AppText, Box, AppTag } from '@/shared/components/ui';
import { SYSTEM, BORDER_WIDTH } from '@/shared/theme';

export type HomeStat = {
  id: string;
  label: string;
  value: string;
  icon?: ReactNode;
  accentColor?: string;
  tagLabel?: string;
  bottomLabel?: string;
};

type HomeStatsRowProps = {
  stats: HomeStat[];
};

type StatCardProps = {
  stat: HomeStat;
  isFirst: boolean;
};

const StatCard = memo(({ stat, isFirst }: StatCardProps) => {
  const cardStyle = useMemo<ViewStyle>(
    () => ({
      borderLeftColor: stat.accentColor ?? SYSTEM.accentMuted,
      borderLeftWidth: BORDER_WIDTH.lg,
    }),
    [stat.accentColor],
  );

  const accessibilityLabel = `${stat.tagLabel ?? stat.label}: ${
    stat.bottomLabel
  } ${stat.value}`;

  return (
    <Box
      variant="statCard"
      mt={isFirst ? undefined : 'md'}
      style={cardStyle}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="text"
    >
      <Box flexDirection="row" alignItems="center">
        <Box mr="sm">
          <AppTag
            label={stat.tagLabel ?? stat.label}
            color={stat.accentColor}
            size="large"
          />
        </Box>
        <AppText variant="caption">
          {stat.bottomLabel}: {stat.value}
        </AppText>
      </Box>
    </Box>
  );
});

StatCard.displayName = 'StatCard';

export const HomeStatsRow = memo(({ stats }: HomeStatsRowProps) => (
  <Box flexDirection="column" gap="sm">
    {stats.map((stat, index) => (
      <StatCard key={stat.id} stat={stat} isFirst={index === 0} />
    ))}
  </Box>
));

HomeStatsRow.displayName = 'HomeStatsRow';
