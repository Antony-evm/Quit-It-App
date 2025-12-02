import { useMutation, useQueryClient } from '@tanstack/react-query';
import { saveFrequency } from '../api/saveFrequency';
import { FREQUENCY_QUERY_KEY } from './useFrequency';
import type {
  Question,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  QuestionnaireAnswerPayload,
  AnswerOptionsPair,
} from '../types';
import type { FrequencyData } from '../api/fetchFrequency';

type SaveFrequencyParams = {
  question: Question;
  mainSelection: SelectedAnswerOption[];
  subSelection: SelectedAnswerSubOption[];
};

const buildPayload = ({
  question,
  mainSelection,
  subSelection,
}: SaveFrequencyParams): QuestionnaireAnswerPayload => {
  const answerOptions: AnswerOptionsPair[] = mainSelection.map(main => {
    const sub = subSelection.find(s => s.mainOptionId === main.optionId);

    return {
      answer_option_id: main.optionId,
      answer_value: main.value,
      answer_type: main.answerType,
      answer_sub_option_id: sub?.optionId ?? null,
      answer_sub_option_value: sub?.value ?? null,
      answer_sub_option_type: sub?.answerType ?? null,
    };
  });

  return {
    question_id: question.id,
    question_code: question.questionCode,
    question_order_id: question.orderId,
    question_variation_id: question.variationId,
    question: question.prompt,
    answer_options: answerOptions,
  };
};

export const useSaveFrequency = (): {
  saveFrequency: (params: SaveFrequencyParams) => void;
  saveFrequencyAsync: (params: SaveFrequencyParams) => Promise<void>;
  isSaving: boolean;
  error: string | null;
  isSuccess: boolean;
  reset: () => void;
} => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: SaveFrequencyParams) => {
      const payload = buildPayload(params);
      return saveFrequency(payload);
    },
    onSuccess: (_data, variables) => {
      // Update the frequency cache with the new values
      const newFrequency: FrequencyData = {};
      variables.mainSelection.forEach(main => {
        const sub = variables.subSelection.find(
          s => s.mainOptionId === main.optionId,
        );
        if (sub) {
          newFrequency[main.value] = sub.value;
        }
      });
      queryClient.setQueryData(FREQUENCY_QUERY_KEY, newFrequency);
    },
  });

  return {
    saveFrequency: mutation.mutate,
    saveFrequencyAsync: mutation.mutateAsync,
    isSaving: mutation.isPending,
    error: mutation.error?.message ?? null,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  };
};
