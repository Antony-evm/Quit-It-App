import { useState, useCallback, useEffect } from 'react';
import { useQuitDate } from './useQuitDate';
import { useUpdateQuitDateMutation } from './useAccountMutations';

type FieldStatus = {
  tone: 'success' | 'error';
  message: string;
} | null;

export const useQuitDateLogic = () => {
  const {
    quitDate,
    isLoading: isQuitDateLoading,
    error: quitDateError,
    refresh: refreshQuitDate,
    isRefetching,
  } = useQuitDate();
  const updateQuitDateMutation = useUpdateQuitDateMutation();

  const [quitDateInput, setQuitDateInput] = useState('');
  const [quitDateStatus, setQuitDateStatus] = useState<FieldStatus>(null);

  useEffect(() => {
    if (quitDate) {
      setQuitDateInput(quitDate.isoDate);
    }
  }, [quitDate]);

  const handleRefresh = useCallback(() => {
    refreshQuitDate();
  }, [refreshQuitDate]);

  const handleSaveQuitDate = useCallback(async () => {
    setQuitDateStatus(null);
    const trimmed = quitDateInput.trim();
    const isIsoDate = /^\d{4}-\d{2}-\d{2}$/.test(trimmed);

    if (!isIsoDate || Number.isNaN(new Date(trimmed).getTime())) {
      setQuitDateStatus({
        tone: 'error',
        message: 'Use the YYYY-MM-DD format for your quit date.',
      });
      return;
    }

    try {
      await updateQuitDateMutation.mutateAsync({ isoDate: trimmed });
      setQuitDateStatus({
        tone: 'success',
        message: 'Quit date saved.',
      });
    } catch {
      setQuitDateStatus({
        tone: 'error',
        message: 'Unable to save quit date right now.',
      });
    }
  }, [quitDateInput, updateQuitDateMutation]);

  return {
    quitDateInput,
    setQuitDateInput,
    quitDateStatus,
    handleSaveQuitDate,
    handleRefresh,
    isRefetching,
    isLoading: isQuitDateLoading && !isRefetching,
    error: quitDateError,
  };
};
