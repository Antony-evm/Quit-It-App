import { useEffect } from 'react';
import { useCravingAnalytics } from '@/features/tracking';

type CravingStatsProps = {
  onStatsLoaded: (cravingCount: number) => void;
};

export const CravingStats = ({ onStatsLoaded }: CravingStatsProps) => {
  const { data: cravingAnalytics } = useCravingAnalytics();

  useEffect(() => {
    if (cravingAnalytics?.total_cravings !== undefined) {
      onStatsLoaded(cravingAnalytics.total_cravings);
    }
  }, [cravingAnalytics, onStatsLoaded]);

  return null;
};
