import { useState, useEffect } from 'react';
import { QuestionnaireAccountService } from '../services/questionnaireAccountService';

/**
 * Hook to access cached questionnaire account question IDs
 * Similar to useTrackingTypes pattern
 */
export const useQuestionnaireAccountData = () => {
  const [questionIds, setQuestionIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadQuestionIds = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Initialize service if not already done
        if (!QuestionnaireAccountService.isInitialized()) {
          await QuestionnaireAccountService.initialize();
        }

        const ids = QuestionnaireAccountService.getQuestionIds();
        setQuestionIds(ids);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to load question IDs'),
        );
        setQuestionIds([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuestionIds();
  }, []);

  const refresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await QuestionnaireAccountService.refresh();
      const ids = QuestionnaireAccountService.getQuestionIds();
      setQuestionIds(ids);
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error('Failed to refresh question IDs'),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const hasQuestionId = (questionId: number): boolean => {
    return QuestionnaireAccountService.hasQuestionId(questionId);
  };

  return {
    questionIds,
    isLoading,
    error,
    refresh,
    hasQuestionId,
    isInitialized: QuestionnaireAccountService.isInitialized(),
  };
};
