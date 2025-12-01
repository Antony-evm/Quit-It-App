import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/shared/auth';

import type {
  Question,
  QuestionnaireAnswerPayload,
  QuestionnaireResponseRecord,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  QuestionnaireCompleteResponse,
} from '../types';
import { fetchQuestion } from '../api/fetchQuestion';
import { submitQuestionAnswer } from '../api/submitAnswer';
import { completeQuestionnaire } from '../api/completeQuestionnaire';
import { generateQuittingPlan } from '../api/fetchQuittingPlan';
import { QUESTIONNAIRE_PLACEHOLDERS } from '../api/endpoints';
import { questionnaireStorage } from '../services/questionnaireStorage';
import { UserStatusService } from '@/shared/services/userStatusService';
import type { QuittingPlan } from '../types';

type UseQuestionnaireOptions = {
  initialOrderId?: number;
  initialVariationId?: number;
};

type NavigationEntry = {
  orderId: number;
  variationId: number;
  questionId: number;
};

const ensureVariationId = (candidates: number[], fallback: number) => {
  const normalized = candidates.filter(
    value => typeof value === 'number' && !Number.isNaN(value),
  );

  if (!normalized.length) {
    return fallback;
  }

  const unique = Array.from(new Set(normalized));

  if (unique.length > 1) {
  }

  return unique[0];
};

export const useQuestionnaire = (options: UseQuestionnaireOptions = {}) => {
  const { isAuthenticated } = useAuth();
  const initialOrderId =
    options.initialOrderId ?? QUESTIONNAIRE_PLACEHOLDERS.orderId;
  const initialVariationId =
    options.initialVariationId ?? QUESTIONNAIRE_PLACEHOLDERS.variationId;

  const initialOrderIdRef = useRef(initialOrderId);
  const initialVariationIdRef = useRef(initialVariationId);

  const queryClient = useQueryClient();

  const [orderId, setOrderId] = useState<number>(initialOrderId);
  const [variationId, setVariationId] = useState<number>(initialVariationId);
  const [isReviewing, setIsReviewing] = useState(false);
  const [history, setHistory] = useState<QuestionnaireResponseRecord[]>([]);
  const [navigationStack, setNavigationStack] = useState<NavigationEntry[]>([]);
  const [generatedPlan, setGeneratedPlan] = useState<QuittingPlan | null>(null);
  const [selections, setSelections] = useState<
    Record<
      number,
      { options: SelectedAnswerOption[]; subOptions: SelectedAnswerSubOption[] }
    >
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

  const submitMutation = useMutation({
    mutationFn: submitQuestionAnswer,
  });

  const completeMutation = useMutation({
    mutationFn: completeQuestionnaire,
  });

  const question: Question | null = fetchedQuestion ?? null;
  const isLoading =
    (isQueryLoading || isQueryFetching) && !question && !isReviewing;
  const loadError = (queryError as Error | null) ?? null;
  const error = submitMutation.error ?? completeMutation.error ?? loadError;

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

    loadHistory().catch(storageError => {});

    return () => {
      isMounted = false;
    };
  }, [question, isLoading, isReviewing, loadError]);

  // Helper function to build answer options for the new payload format
  const buildAnswerOptions = (
    question: Question,
    selectedOptions: SelectedAnswerOption[],
    selectedSubOptions: SelectedAnswerSubOption[],
  ) => {
    if (question.subCombination === 'N:N' && selectedSubOptions.length > 0) {
      // For N:N combinations (frequency grid), pair each main option with its sub-option
      // Use mainOptionId to find the correct sub-option for each main option
      return selectedOptions.map(option => {
        const subOption = selectedSubOptions.find(
          sub => sub.mainOptionId === option.optionId,
        );
        return {
          answer_option_id: option.optionId,
          answer_value: option.value,
          answer_type: option.answerType,
          answer_sub_option_id: subOption?.optionId || null,
          answer_sub_option_value: subOption?.value || null,
          answer_sub_option_type: subOption?.answerType || null,
        };
      });
    } else if (selectedSubOptions.length > 0) {
      // For other combinations (N:1, etc), handle differently if needed
      // For now, we'll just include main options with first sub-option
      return selectedOptions.map(option => ({
        answer_option_id: option.optionId,
        answer_value: option.value,
        answer_type: option.answerType,
        answer_sub_option_id: selectedSubOptions[0]?.optionId || null,
        answer_sub_option_value: selectedSubOptions[0]?.value || null,
        answer_sub_option_type: selectedSubOptions[0]?.answerType || null,
      }));
    } else {
      // For regular questions, just return main options without sub-options
      return selectedOptions.map(option => ({
        answer_option_id: option.optionId,
        answer_value: option.value,
        answer_type: option.answerType,
        answer_sub_option_id: null,
        answer_sub_option_value: null,
        answer_sub_option_type: null,
      }));
    }
  };

  const submitAnswers = useCallback(
    async (
      selectedOptions: SelectedAnswerOption[],
      selectedSubOptions: SelectedAnswerSubOption[] = [],
    ) => {
      if (!question) {
        return;
      }

      try {
        if (!question.questionCode) {
        }

        const payload = {
          question_id: question.id,
          question_code: question.questionCode,
          question_order_id: question.orderId,
          question_variation_id: question.variationId,
          question: question.prompt,
          answer_options: buildAnswerOptions(
            question,
            selectedOptions,
            selectedSubOptions,
          ),
        };

        await submitMutation.mutateAsync(payload);

        const record: QuestionnaireResponseRecord = {
          questionId: question.id,
          questionCode: question.questionCode,
          questionOrderId: question.orderId,
          questionVariationId: question.variationId,
          question: question.prompt,
          answerType: question.answerType,
          answerHandling: question.answerHandling,
          answerOptions: payload.answer_options,
          subAnswerType: question.subAnswerType,
          subAnswerHandling: question.subAnswerHandling,
        };

        await questionnaireStorage.save(record);
        setSelections(prev => ({
          ...prev,
          [question.id]: {
            options: selectedOptions,
            subOptions: selectedSubOptions,
          },
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

          try {
            const plan = await generateQuittingPlan();
            setGeneratedPlan(plan);
          } catch (planError) {
            console.error('Failed to generate quitting plan:', planError);
            // Continue to review even if plan generation fails?
            // Or maybe show error? For now, let's log and continue,
            // but maybe the review page will handle missing plan.
          }

          setIsReviewing(true);
          return;
        }

        const nextOrderId = question.orderId + 1;
        setOrderId(nextOrderId);
        setVariationId(nextVariationId);
        setIsReviewing(false);
      } catch (caughtError) {
        // Error handled by mutation state
      }
    },
    [question, submitMutation],
  );

  const completeQuestionnaireFlow =
    useCallback(async (): Promise<QuestionnaireCompleteResponse | null> => {
      try {
        return await completeMutation.mutateAsync();
      } catch (caughtError) {
        return null;
      }
    }, [completeMutation]);

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
    submitMutation.reset();
    completeMutation.reset();
    setOrderId(initialOrderIdRef.current);
    setVariationId(initialVariationIdRef.current);
  }, [queryClient, submitMutation, completeMutation]);

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
      submitMutation.reset();
      completeMutation.reset();

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
        .catch(storageError => {});

      return nextStack;
    });
  }, [submitMutation, completeMutation]);

  const derived = useMemo(
    () => ({
      prompt: question?.prompt ?? '',
      explanation: question?.explanation ?? '',
    }),
    [question],
  );

  const currentSelection = question ? selections[question.id] : undefined;
  const currentOptions = useMemo(
    () => currentSelection?.options ?? [],
    [currentSelection?.options],
  );
  const currentSubOptions = useMemo(
    () => currentSelection?.subOptions ?? [],
    [currentSelection?.subOptions],
  );
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
      submitMutation.reset();
      completeMutation.reset();

      return prev;
    });
  }, [
    setOrderId,
    setVariationId,
    setIsReviewing,
    setNavigationStack,
    submitMutation,
    completeMutation,
  ]);

  return {
    question,
    orderId: activeOrderId,
    variationId: activeVariationId,
    isLoading,
    isSubmitting: submitMutation.isPending,
    isCompleting: completeMutation.isPending,
    error,
    isReviewing,
    history,
    completionData: completeMutation.data ?? null,
    generatedPlan,
    ...derived,
    refresh,
    submitAnswers,
    completeQuestionnaireFlow,
    restart,
    goBack,
    canGoBack,
    selection: currentSelection,
    selectedOptions: currentOptions,
    selectedSubOptions: currentSubOptions,
    resumeFromReview,
    canResumeReview,
  };
};
