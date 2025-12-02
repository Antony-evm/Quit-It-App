import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveTriggers } from '../api/saveTriggers';
import { TRIGGERS_QUERY_KEY } from './useTriggers';
import type {
  Question,
  SelectedAnswerOption,
  QuestionnaireAnswerPayload,
  AnswerOptionsPair,
} from '../types';

type SaveTriggersParams = {
  question: Question;
  selection: SelectedAnswerOption[];
};

const buildPayload = ({
  question,
  selection,
}: SaveTriggersParams): QuestionnaireAnswerPayload => {
  const answerOptions: AnswerOptionsPair[] = selection.map(selected => ({
    answer_option_id: selected.optionId,
    answer_value: selected.value,
    answer_type: selected.answerType,
    answer_sub_option_id: null,
    answer_sub_option_value: null,
    answer_sub_option_type: null,
  }));

  return {
    question_id: question.id,
    question_code: question.questionCode,
    question_order_id: question.orderId,
    question_variation_id: question.variationId,
    question: question.prompt,
    answer_options: answerOptions,
  };
};

export const useSaveTriggers = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: SaveTriggersParams) => {
      const payload = buildPayload(params);
      return saveTriggers(payload);
    },
    onSuccess: (_data, variables) => {
      // Update the triggers cache with the new values
      const newTriggers = variables.selection.map(s => s.value);
      queryClient.setQueryData(TRIGGERS_QUERY_KEY, newTriggers);
    },
  });

  return {
    saveTriggers: mutation.mutate,
    saveTriggersAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
