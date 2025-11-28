import { authenticatedGet } from '@/shared/api/apiConfig';
import type {
  AnswerHandling,
  AnswerOption,
  AnswerSubOption,
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
  questionCode?: string;
};

const createQueryString = (
  orderId: number,
  variationId: number,
  questionCode?: string,
) => {
  if (questionCode) {
    return `question_code=${questionCode}`;
  }
  return `order_id=${orderId}&variation_id=${variationId}`;
};

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

const mapSubOptions = (
  record: QuestionResponse['sub_options'] = {},
): AnswerSubOption[] =>
  Object.entries(record).map(([subOptionId, subOption]) => ({
    id: Number(subOptionId),
    label: subOption.value,
    value: subOption.value,
    combination: subOption.combination,
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
  const subOptions = mapSubOptions(data.sub_options);
  const questionDefault = parseDefaultValue(data.default_value);
  const subQuestionDefault = parseDefaultValue(data.sub_default_value);

  return {
    id: data.question_id,
    questionCode: data.code,
    orderId: data.order_id,
    variationId: data.variation_id,
    prompt: data.question,
    explanation: data.explanation,
    answerType: parseAnswerType(data.answer_type ?? ''),
    answerHandling: parseAnswerHandling(data.answer_handling ?? ''),
    options,
    defaultValue: extractQuestionDefaultValue(options, questionDefault),
    subAnswerType: data.sub_answer_type
      ? parseAnswerType(data.sub_answer_type)
      : null,
    subAnswerHandling: data.sub_answer_handling
      ? parseAnswerHandling(data.sub_answer_handling)
      : null,
    subOptions,
    subDefaultValue: subQuestionDefault,
    subCombination: data.sub_combination ?? null,
    units: data.answer_units ?? null,
    maxQuestion: data.max_question,
  };
};

export const fetchQuestion = async (
  options: QuestionnaireRequestOptions = {},
): Promise<Question | null> => {
  const {
    orderId = QUESTIONNAIRE_DEFAULT_PARAMS.orderId,
    variationId = QUESTIONNAIRE_DEFAULT_PARAMS.variationId,
    questionCode,
  } = options;

  const requestUrl = `${QUESTIONNAIRE_ENDPOINT}?${createQueryString(
    orderId,
    variationId,
    questionCode,
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

  const mappedQuestion = mapQuestionResponse(resolved);

  return mappedQuestion;
};
