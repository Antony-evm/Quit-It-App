import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';

import type {
  Question,
  QuestionnaireAnswerPayload,
  QuestionnaireResponseRecord,
  SelectedAnswerOption,
  QuestionnaireCompleteResponse,
} from '../types';
import { fetchQuestion } from '../api/fetchQuestion';
import { submitQuestionAnswer } from '../api/submitAnswer';
import { completeQuestionnaire } from '../api/completeQuestionnaire';
import { QUESTIONNAIRE_PLACEHOLDERS } from '../api/endpoints';
import { questionnaireStorage } from '../data/questionnaireStorage';
import { useBackendUserIdSafe } from '@/shared/hooks';
import { UserStatusService } from '@/shared/services/userStatusService';

type UseQuestionnaireOptions = {
  userId?: number;
  initialOrderId?: number;
  initialVariationId?: number;
};

type NavigationEntry = {
  orderId: number;
  variationId: number;
  questionId: number;
};

const DEFAULT_USER_ID = 2;

const ensureVariationId = (candidates: number[], fallback: number) => {
  const normalized = candidates.filter(
    value => typeof value === 'number' && !Number.isNaN(value),
  );

  if (!normalized.length) {
    return fallback;
  }

  const unique = Array.from(new Set(normalized));

  if (unique.length > 1) {
    console.warn(
      'Multiple next_question_variation_id values detected. Using the first one.',
      unique,
    );
  }

  return unique[0];
};

export const useQuestionnaire = (options: UseQuestionnaireOptions = {}) => {
  const { isAuthenticated } = useAuth();
  const backendUserId = useBackendUserIdSafe();
  const userId = options.userId ?? backendUserId ?? DEFAULT_USER_ID;
  const initialOrderId =
    options.initialOrderId ?? QUESTIONNAIRE_PLACEHOLDERS.orderId;
  const initialVariationId =
    options.initialVariationId ?? QUESTIONNAIRE_PLACEHOLDERS.variationId;

  const initialOrderIdRef = useRef(initialOrderId);
  const initialVariationIdRef = useRef(initialVariationId);

  const queryClient = useQueryClient();

  const [orderId, setOrderId] = useState<number>(initialOrderId);
  const [variationId, setVariationId] = useState<number>(initialVariationId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionData, setCompletionData] =
    useState<QuestionnaireCompleteResponse | null>(null);
  const [history, setHistory] = useState<QuestionnaireResponseRecord[]>([]);
  const [navigationStack, setNavigationStack] = useState<NavigationEntry[]>([]);
  const [selections, setSelections] = useState<
    Record<number, SelectedAnswerOption[]>
  >({});

  const {
    data: fetchedQuestion,
    error: queryError,
    isLoading: isQueryLoading,
    isFetching: isQueryFetching,
    refetch,
  } = useQuery({
    queryKey: ['questionnaire', orderId, variationId],
    enabled: !isReviewing && isAuthenticated, // Only fetch when authenticated and not reviewing
    queryFn: () =>
      fetchQuestion({
        orderId,
        variationId,
      }),
  });

  const question: Question | null = fetchedQuestion ?? null;
  const isLoading =
    (isQueryLoading || isQueryFetching) && !question && !isReviewing;
  const loadError = (queryError as Error | null) ?? null;
  const error = submitError ?? loadError;

  useEffect(() => {
    if (isReviewing || !question || loadError) {
      return;
    }

    setNavigationStack(prev => {
      const existingIndex = prev.findIndex(
        entry => entry.questionId === question.id,
      );

      const base = existingIndex >= 0 ? prev.slice(0, existingIndex + 1) : prev;
      const alreadyCurrent =
        base.length &&
        base[base.length - 1]?.questionId === question.id &&
        base[base.length - 1]?.orderId === question.orderId &&
        base[base.length - 1]?.variationId === question.variationId;

      if (alreadyCurrent) {
        return base;
      }

      return [
        ...base,
        {
          orderId: question.orderId,
          variationId: question.variationId,
          questionId: question.id,
        },
      ];
    });
  }, [question, isReviewing, loadError]);

  useEffect(() => {
    if (isReviewing || isLoading || question || loadError) {
      return;
    }

    let isMounted = true;
    const loadHistory = async () => {
      const records = await questionnaireStorage.all();
      if (!isMounted) {
        return;
      }
      setHistory(records);
      setNavigationStack([]);
      setSelections({});
      setIsReviewing(true);
    };

    loadHistory().catch(storageError => {
      console.error(
        'Failed to load questionnaire history from storage',
        storageError,
      );
    });

    return () => {
      isMounted = false;
    };
  }, [question, isLoading, isReviewing, loadError]);

  const submitAnswers = useCallback(
    async (selectedOptions: SelectedAnswerOption[]) => {
      if (!question) {
        return;
      }

      try {
        setIsSubmitting(true);
        setSubmitError(null);

        console.log('[submitAnswers] Question data:', {
          id: question.id,
          questionCode: question.questionCode,
          orderId: question.orderId,
          variationId: question.variationId,
          prompt: question.prompt,
        });
        console.log('[submitAnswers] Selected options:', selectedOptions);

        if (!question.questionCode) {
          console.error(
            '[submitAnswers] ERROR: question.questionCode is missing!',
            question.questionCode,
          );
          console.error('[submitAnswers] Full question object:', question);
        }

        const payload = {
          user_id: userId,
          question_id: question.id,
          question_code: question.questionCode,
          question_order_id: question.orderId,
          question_variation_id: question.variationId,
          question: question.prompt,
          answer_options: selectedOptions.map(option => ({
            answer_option_id: option.optionId,
            answer_value: option.value,
            answer_type: option.answerType,
          })),
        };

        console.log(
          '[submitAnswers] Final payload before API call:',
          JSON.stringify(payload, null, 2),
        );

        await submitQuestionAnswer(payload);

        const record: QuestionnaireResponseRecord = {
          questionId: question.id,
          questionCode: question.questionCode,
          questionOrderId: question.orderId,
          questionVariationId: question.variationId,
          question: question.prompt,
          answerType: question.answerType,
          answerHandling: question.answerHandling,
          answerOptions: payload.answer_options,
        };

        await questionnaireStorage.save(record);

        setSelections(prev => ({
          ...prev,
          [question.id]: selectedOptions,
        }));

        setHistory(prev => {
          const existingIndex = prev.findIndex(
            entry => entry.questionId === record.questionId,
          );

          if (existingIndex >= 0) {
            const next = [...prev];
            next[existingIndex] = record;
            return next;
          }

          return [...prev, record];
        });

        const nextVariationId = ensureVariationId(
          selectedOptions.map(option => option.nextVariationId),
          question.variationId,
        );

        if (nextVariationId === -1) {
          const historyRecords = await questionnaireStorage.all();
          setHistory(historyRecords);
          setIsReviewing(true);
          return;
        }

        const nextOrderId = question.orderId + 1;

        setOrderId(nextOrderId);
        setVariationId(nextVariationId);
        setIsReviewing(false);
      } catch (caughtError) {
        setSubmitError(caughtError as Error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [question, userId],
  );

  const completeQuestionnaireFlow =
    useCallback(async (): Promise<QuestionnaireCompleteResponse | null> => {
      try {
        setIsCompleting(true);
        setSubmitError(null);

        const response = await completeQuestionnaire();
        setCompletionData(response);

        return response;
      } catch (caughtError) {
        setSubmitError(caughtError as Error);
        return null;
      } finally {
        setIsCompleting(false);
      }
    }, []);

  const refresh = useCallback(() => {
    return refetch();
  }, [refetch]);

  const restart = useCallback(async () => {
    await questionnaireStorage.clear();
    queryClient.removeQueries({ queryKey: ['questionnaire'] });
    setHistory([]);
    setSelections({});
    setNavigationStack([]);
    setIsReviewing(false);
    setSubmitError(null);
    setOrderId(initialOrderIdRef.current);
    setVariationId(initialVariationIdRef.current);
  }, [queryClient]);

  const goBack = useCallback(() => {
    setNavigationStack(prev => {
      if (prev.length <= 1) {
        return prev;
      }

      const popped = prev[prev.length - 1];
      const nextStack = prev.slice(0, -1);
      const destination = nextStack[nextStack.length - 1];

      setOrderId(destination.orderId);
      setVariationId(destination.variationId);
      setIsReviewing(false);
      setSubmitError(null);

      setHistory(existing =>
        existing.filter(record => record.questionId !== popped.questionId),
      );

      setSelections(existing => {
        const copy = { ...existing };
        delete copy[popped.questionId];
        return copy;
      });

      questionnaireStorage
        .removeByQuestionId(popped.questionId)
        .catch(storageError => {
          console.error(
            'Failed to remove questionnaire record from storage',
            storageError,
          );
        });

      return nextStack;
    });
  }, []);

  const derived = useMemo(
    () => ({
      prompt: question?.prompt ?? '',
      explanation: question?.explanation ?? '',
    }),
    [question],
  );

  const currentSelection = question ? selections[question.id] : undefined;
  const canGoBack = navigationStack.length > 1;
  const canResumeReview = navigationStack.length > 0;

  const activeOrderId = question?.orderId ?? orderId;
  const activeVariationId = question?.variationId ?? variationId;

  const resumeFromReview = useCallback(() => {
    setNavigationStack(prev => {
      if (!prev.length) {
        return prev;
      }

      const lastEntry = prev[prev.length - 1];

      setOrderId(lastEntry.orderId);
      setVariationId(lastEntry.variationId);
      setIsReviewing(false);
      setSubmitError(null);

      return prev;
    });
  }, [
    setOrderId,
    setVariationId,
    setIsReviewing,
    setSubmitError,
    setNavigationStack,
  ]);

  return {
    question,
    orderId: activeOrderId,
    variationId: activeVariationId,
    isLoading,
    isSubmitting,
    isCompleting,
    error,
    isReviewing,
    history,
    completionData,
    ...derived,
    refresh,
    submitAnswers,
    completeQuestionnaireFlow,
    restart,
    goBack,
    canGoBack,
    selection: currentSelection,
    resumeFromReview,
    canResumeReview,
  };
};
