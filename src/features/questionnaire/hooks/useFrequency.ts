import { useCallback, useEffect, useState } from 'react';
import { FrequencyService } from '../services/frequencyService';
import { FrequencyApiData } from '../api/fetchFrequency';
import { useBackendUserIdSafe } from '@/shared/hooks';

interface UseFrequencyResult {
  frequency: FrequencyApiData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useFrequency = (): UseFrequencyResult => {
  const [frequency, setFrequency] = useState<FrequencyApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendUserId = useBackendUserIdSafe();

  const loadFrequency = useCallback(
    async (forceRefresh = false) => {
      try {
        setError(null);
        setIsLoading(true);

        if (!backendUserId) {
          throw new Error('Backend user ID not available');
        }

        await FrequencyService.initialize({
          userId: backendUserId,
          forceRefresh,
        });
        const currentFrequency = FrequencyService.getFrequency();
        setFrequency(currentFrequency);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load frequency data';
        setError(errorMessage);
        console.error('[useFrequency] Error loading frequency:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [backendUserId],
  );

  const refresh = useCallback(async () => {
    await loadFrequency(true);
  }, [loadFrequency]);

  useEffect(() => {
    loadFrequency();
  }, [loadFrequency]);

  return {
    frequency,
    isLoading,
    error,
    refresh,
  };
};
