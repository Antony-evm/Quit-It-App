import { ReactNode } from 'react';

import { AppText, Box, AppTag } from '@/shared/components/ui';
import { COLOR_PALETTE, BORDER_WIDTH } from '@/shared/theme';

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
};

export const HomeStatsRow = ({ stats }: HomeStatsRowProps) => (
  <Box flexDirection="column">
    {stats.map((stat, index) => {
      return (
        <Box
          key={stat.label}
          variant="statCard"
          mt={index > 0 ? 'md' : undefined}
          style={{
            borderLeftColor: stat.accentColor ?? COLOR_PALETTE.accentMuted,
            borderLeftWidth: BORDER_WIDTH.lg,
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <Box mr="sm">
              <AppTag
                label={stat.tagLabel ?? stat.label}
                color={stat.tagBackgroundColor}
                size="large"
              />
            </Box>
            <AppText variant="caption">
              {stat.bottomLabel}: {stat.value}
            </AppText>
          </Box>
        </Box>
      );
    })}
  </Box>
);
