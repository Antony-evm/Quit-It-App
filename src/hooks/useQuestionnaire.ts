import { useCallback, useEffect, useMemo, useState } from 'react';

import type { QuestionnairePayload } from '../types/questionnaire';
import {
  fetchQuestionnaire,
  QUESTIONNAIRE_PLACEHOLDERS,
} from '../services/questionnaireService';

type UseQuestionnaireState = {
  isLoading: boolean;
  error: Error | null;
  data: QuestionnairePayload | null;
};

const INITIAL_STATE: UseQuestionnaireState = {
  isLoading: false,
  error: null,
  data: null,
};

export const useQuestionnaire = () => {
  const [state, setState] = useState<UseQuestionnaireState>(INITIAL_STATE);

  const load = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await fetchQuestionnaire({
        orderId: QUESTIONNAIRE_PLACEHOLDERS.orderId,
        variationId: QUESTIONNAIRE_PLACEHOLDERS.variationId,
      });
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const derived = useMemo(
    () => ({
      title: state.data?.title ?? 'Questionnaire Title Placeholder',
      subtitle: state.data?.subtitle ?? 'Questionnaire subtitle placeholder',
      questions: state.data?.questions ?? [],
    }),
    [state.data],
  );

  return {
    ...state,
    ...derived,
    refresh: load,
  };
};
