import { Platform } from 'react-native';

import type {
  AnswerHandling,
  AnswerOption,
  AnswerType,
  Question,
  QuestionResponse,
  QuestionnaireAnswerPayload,
} from '../types/questionnaire';

type MaybeEnv = {
  process?: {
    env?: Record<string, string | undefined>;
  };
};

const getEnvValue = (key: string): string | undefined =>
  ((globalThis as MaybeEnv | undefined)?.process?.env ?? {})[key];

const NORMALIZE_URL_TRAILING_SLASH = /\/$/;
const resolveBaseUrl = () => {
  const envUrl =
    getEnvValue('QUESTIONNAIRE_API_BASE_URL') ?? getEnvValue('API_BASE_URL');

  if (envUrl) {
    return envUrl.replace(NORMALIZE_URL_TRAILING_SLASH, '');
  }

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  return 'http://localhost:8000';
};

const QUESTIONNAIRE_BASE_URL = resolveBaseUrl();
const QUESTIONNAIRE_ENDPOINT = `${QUESTIONNAIRE_BASE_URL}/api/v1/questionnaire`;
const QUESTIONNAIRE_ANSWER_ENDPOINT = `${QUESTIONNAIRE_ENDPOINT}/answer`;

const DEFAULT_QUERY_PARAMS = {
  orderId: 0,
  variationId: 0,
};

type QuestionnaireRequestOptions = {
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

const mapOptions = (
  record: QuestionResponse['options'] = {},
): AnswerOption[] =>
  Object.entries(record).map(([optionId, option]) => ({
    id: Number(optionId),
    label: option.value,
    value: option.value,
    nextVariationId: option.next_question_variation_id,
  }));

const mapQuestionResponse = (data: QuestionResponse): Question => ({
  id: data.question_id,
  orderId: data.order_id,
  variationId: data.variation_id,
  prompt: data.question,
  explanation: data.explanation,
  answerType: parseAnswerType(data.answer_type ?? ''),
  answerHandling: parseAnswerHandling(data.answer_handling ?? ''),
  options: mapOptions(data.options),
});

export const fetchQuestion = async (
  options: QuestionnaireRequestOptions = {},
): Promise<Question | null> => {
  const {
    orderId = DEFAULT_QUERY_PARAMS.orderId,
    variationId = DEFAULT_QUERY_PARAMS.variationId,
  } = options;

  const requestUrl = `${QUESTIONNAIRE_ENDPOINT}?${createQueryString(
    orderId,
    variationId,
  )}`;

  const response = await fetch(requestUrl);

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

export const submitQuestionAnswer = async (
  payload: QuestionnaireAnswerPayload,
): Promise<void> => {
  const response = await fetch(QUESTIONNAIRE_ANSWER_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to submit questionnaire answer');
  }
};

export const QUESTIONNAIRE_PLACEHOLDERS = {
  orderId: DEFAULT_QUERY_PARAMS.orderId,
  variationId: DEFAULT_QUERY_PARAMS.variationId,
  endpoint: QUESTIONNAIRE_ENDPOINT,
};

export type { QuestionnaireRequestOptions };
export {
  QUESTIONNAIRE_BASE_URL,
  QUESTIONNAIRE_ENDPOINT,
  QUESTIONNAIRE_ANSWER_ENDPOINT,
};
