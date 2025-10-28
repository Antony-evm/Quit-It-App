import { useCallback, useEffect, useMemo, useState } from 'react';

import type {
  Question,
  QuestionnaireResponseRecord,
  SelectedAnswerOption,
} from '../types/questionnaire';
import {
  fetchQuestion,
  QUESTIONNAIRE_PLACEHOLDERS,
  submitQuestionAnswer,
  type QuestionnaireRequestOptions,
} from '../services/questionnaireService';
import { questionnaireStorage } from '../services/questionnaireStorage';

type UseQuestionnaireOptions = {
  userId?: number;
  initialOrderId?: number;
  initialVariationId?: number;
};

type QuestionnaireState = {
  isLoading: boolean;
  isSubmitting: boolean;
  error: Error | null;
  question: Question | null;
  orderId: number;
  variationId: number;
  isReviewing: boolean;
  history: QuestionnaireResponseRecord[];
};

const DEFAULT_USER_ID = 2;

const createInitialState = (): QuestionnaireState => ({
  isLoading: false,
  isSubmitting: false,
  error: null,
  question: null,
  orderId: QUESTIONNAIRE_PLACEHOLDERS.orderId,
  variationId: QUESTIONNAIRE_PLACEHOLDERS.variationId,
  isReviewing: false,
  history: [],
});

const ensureVariationId = (candidates: number[], fallback: number) => {
  const normalized = candidates.filter(
    (value) => typeof value === 'number' && !Number.isNaN(value),
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
  const userId = options.userId ?? DEFAULT_USER_ID;
  const [state, setState] = useState<QuestionnaireState>(createInitialState);

  const loadQuestion = useCallback(
    async (
      requestOptions: QuestionnaireRequestOptions = {
        orderId: state.orderId,
        variationId: state.variationId,
      },
    ) => {
      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          orderId: requestOptions.orderId ?? prev.orderId,
          variationId: requestOptions.variationId ?? prev.variationId,
        }));
        const question = await fetchQuestion(requestOptions);

        if (!question) {
          const history = await questionnaireStorage.all();
          setState((prev) => ({
            ...prev,
            isLoading: false,
            question: null,
            isReviewing: true,
            history,
          }));
          return;
        }

        setState((prev) => ({
          ...prev,
          question,
          isLoading: false,
          isReviewing: false,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error as Error,
        }));
      }
    },
    [state.orderId, state.variationId],
  );

  useEffect(() => {
    const initialOrderId =
      options.initialOrderId ?? QUESTIONNAIRE_PLACEHOLDERS.orderId;
    const initialVariationId =
      options.initialVariationId ?? QUESTIONNAIRE_PLACEHOLDERS.variationId;

    loadQuestion({
      orderId: initialOrderId,
      variationId: initialVariationId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitAnswers = useCallback(
    async (selectedOptions: SelectedAnswerOption[]) => {
      if (!state.question) {
        return;
      }

      try {
        setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

        const payload = {
          user_id: userId,
          question_id: state.question.id,
          question: state.question.prompt,
          answer_options: selectedOptions.map((option) => ({
            answer_option_id: option.optionId,
            answer_value: option.value,
            answer_type: option.answerType,
          })),
        };

        await submitQuestionAnswer(payload);

        const record: QuestionnaireResponseRecord = {
          questionId: state.question.id,
          question: state.question.prompt,
          answerType: state.question.answerType,
          answerHandling: state.question.answerHandling,
          answerOptions: payload.answer_options,
        };

        await questionnaireStorage.append(record);

        const nextVariationId = ensureVariationId(
          selectedOptions.map((option) => option.nextVariationId),
          state.question.variationId,
        );

        if (nextVariationId === -1) {
          const history = await questionnaireStorage.all();
          setState((prev) => ({
            ...prev,
            isSubmitting: false,
            isReviewing: true,
            question: null,
            history,
          }));
          return;
        }

        const nextOrderId = state.question.orderId + 1;
        await loadQuestion({
          orderId: nextOrderId,
          variationId: nextVariationId,
        });
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          history: [...prev.history, record],
          orderId: nextOrderId,
          variationId: nextVariationId,
        }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isSubmitting: false,
          error: error as Error,
        }));
      }
    },
    [loadQuestion, state.question, userId],
  );

  const refresh = useCallback(() => {
    return loadQuestion({
      orderId: state.orderId,
      variationId: state.variationId,
    });
  }, [loadQuestion, state.orderId, state.variationId]);

  const restart = useCallback(async () => {
    await questionnaireStorage.clear();
    setState(createInitialState());
    await loadQuestion({
      orderId: QUESTIONNAIRE_PLACEHOLDERS.orderId,
      variationId: QUESTIONNAIRE_PLACEHOLDERS.variationId,
    });
  }, [loadQuestion]);

  const derived = useMemo(
    () => ({
      prompt: state.question?.prompt ?? '',
      explanation: state.question?.explanation ?? '',
    }),
    [state.question],
  );

  return {
    ...state,
    ...derived,
    refresh,
    submitAnswers,
    restart,
  };
};
