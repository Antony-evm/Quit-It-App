import { useCallback, useEffect, useState } from 'react';
import { QuittingPlan } from '../types';
import { QuittingPlanService } from '../services/quittingPlanService';
import { useBackendUserIdSafe } from '@/shared/hooks';

interface UseQuittingPlanResult {
  plan: QuittingPlan | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useQuittingPlan = (): UseQuittingPlanResult => {
  const [plan, setPlan] = useState<QuittingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUserId = useBackendUserIdSafe();

  const loadPlan = useCallback(
    async (forceRefresh = false) => {
      try {
        setError(null);
        setIsLoading(true);

        if (!backendUserId) {
          throw new Error('Backend user ID not available');
        }

        await QuittingPlanService.initialize({
          userId: backendUserId,
          forceRefresh,
        });
        const currentPlan = QuittingPlanService.getPlan();
        setPlan(currentPlan);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load quitting plan';
        setError(errorMessage);
        console.error('[useQuittingPlan] Error loading plan:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [backendUserId],
  );

  const refresh = useCallback(async () => {
    await loadPlan(true);
  }, [loadPlan]);

  useEffect(() => {
    loadPlan();
  }, [loadPlan]);

  return {
    plan,
    isLoading,
    error,
    refresh,
  };
};
