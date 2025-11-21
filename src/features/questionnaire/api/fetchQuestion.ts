import { authenticatedGet } from '@/shared/api/apiConfig';
import type {
  AnswerHandling,
  AnswerOption,
  AnswerType,
  Question,
  QuestionResponse,
} from '../types';
import {
  QUESTIONNAIRE_DEFAULT_PARAMS,
  QUESTIONNAIRE_ENDPOINT,
} from './endpoints';

export type QuestionnaireRequestOptions = {
  orderId?: number;
  variationId?: number;
};

const createQueryString = (orderId: number, variationId: number) =>
  `order_id=${orderId}&variation_id=${variationId}`;

const parseAnswerType = (value: string): AnswerType => {
  switch (value) {
    case 'multiple_choice':
    case 'numeric':
    case 'time':
    case 'date':
      return value;
    default:
      return 'unknown';
  }
};

const parseAnswerHandling = (value: string): AnswerHandling => {
  switch (value) {
    case 'single':
    case 'all':
    case 'range':
    case 'max':
      return value;
    default:
      return 'unknown';
  }
};

const parseDefaultValue = (value: string | null | undefined): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const mapOptions = (record: QuestionResponse['options'] = {}): AnswerOption[] =>
  Object.entries(record).map(([optionId, option]) => ({
    id: Number(optionId),
    label: option.value,
    value: option.value,
    nextVariationId: option.next_question_variation_id,
    defaultValue: parseDefaultValue(option.default_value),
  }));

const extractQuestionDefaultValue = (
  options: AnswerOption[],
  fallback: number | null,
): number | null => {
  const candidate = options.find(
    option => option.defaultValue !== null && option.defaultValue !== undefined,
  );

  if (
    candidate?.defaultValue !== null &&
    candidate?.defaultValue !== undefined
  ) {
    return candidate.defaultValue;
  }

  return fallback ?? null;
};

const mapQuestionResponse = (data: QuestionResponse): Question => {
  const options = mapOptions(data.options);
  const questionDefault = parseDefaultValue(data.default_value);

  return {
    id: data.question_id,
    orderId: data.order_id,
    variationId: data.variation_id,
    prompt: data.question,
    explanation: data.explanation,
    answerType: parseAnswerType(data.answer_type ?? ''),
    answerHandling: parseAnswerHandling(data.answer_handling ?? ''),
    options,
    defaultValue: extractQuestionDefaultValue(options, questionDefault),
  };
};

export const fetchQuestion = async (
  options: QuestionnaireRequestOptions = {},
): Promise<Question | null> => {
  const {
    orderId = QUESTIONNAIRE_DEFAULT_PARAMS.orderId,
    variationId = QUESTIONNAIRE_DEFAULT_PARAMS.variationId,
  } = options;

  const requestUrl = `${QUESTIONNAIRE_ENDPOINT}?${createQueryString(
    orderId,
    variationId,
  )}`;

  const response = await authenticatedGet(requestUrl);

  if (response.status === 404 || response.status === 204) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to load questionnaire data');
  }

  const payload = (await response.json()) as
    | QuestionResponse
    | { data: QuestionResponse };

  const resolved = 'data' in payload ? payload.data : payload;
  return mapQuestionResponse(resolved);
};
