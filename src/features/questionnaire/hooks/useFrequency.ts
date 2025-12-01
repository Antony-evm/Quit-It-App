import { useCallback, useEffect, useState } from 'react';
import { FrequencyService } from '../services/frequencyService';
import { FrequencyData } from '../api/fetchFrequency';

interface UseFrequencyResult {
  frequency: FrequencyData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useFrequency = (): UseFrequencyResult => {
  const [frequency, setFrequency] = useState<FrequencyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFrequency = useCallback(async (forceRefresh = false) => {
    try {
      setError(null);
      setIsLoading(true);

      await FrequencyService.initialize({ forceRefresh });
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
  }, []);

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
