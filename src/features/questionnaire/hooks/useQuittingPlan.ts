import { useCallback, useEffect, useState } from 'react';
import { QuittingPlan } from '../types/plan';
import { QuittingPlanService } from '../services/quittingPlanService';

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

  const loadPlan = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      setIsLoading(true);

      await QuittingPlanService.initialize({ forceRefresh });
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
  }, []);

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
