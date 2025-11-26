import { useCallback, useEffect, useState } from 'react';
import { TriggersService } from '../services/triggersService';

interface UseTriggersResult {
  triggers: string[] | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useTriggers = (): UseTriggersResult => {
  const [triggers, setTriggers] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTriggers = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      setIsLoading(true);

      await TriggersService.initialize({ forceRefresh });
      const currentTriggers = TriggersService.getTriggers();
      setTriggers(currentTriggers);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load triggers';
      setError(errorMessage);
      console.error('[useTriggers] Error loading triggers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await loadTriggers(true);
  }, [loadTriggers]);

  useEffect(() => {
    loadTriggers();
  }, [loadTriggers]);

  return {
    triggers,
    isLoading,
    error,
    refresh,
  };
};
