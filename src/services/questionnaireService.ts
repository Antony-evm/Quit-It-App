import type { QuestionnairePayload } from '../types/questionnaire';

const QUESTIONNAIRE_ENDPOINT = 'http://localhost:8080/api/v1/questionnaire';

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

export const fetchQuestionnaire = async (
  options: QuestionnaireRequestOptions = {},
): Promise<QuestionnairePayload> => {
  const {
    orderId = DEFAULT_QUERY_PARAMS.orderId,
    variationId = DEFAULT_QUERY_PARAMS.variationId,
  } = options;

  const requestUrl = `${QUESTIONNAIRE_ENDPOINT}?${createQueryString(
    orderId,
    variationId,
  )}`;

  const response = await fetch(requestUrl);

  if (!response.ok) {
    const error = new Error('Failed to load questionnaire data');
    throw error;
  }

  const payload = (await response.json()) as QuestionnairePayload;
  return payload;
};

export const QUESTIONNAIRE_PLACEHOLDERS = {
  orderId: DEFAULT_QUERY_PARAMS.orderId,
  variationId: DEFAULT_QUERY_PARAMS.variationId,
  endpoint: QUESTIONNAIRE_ENDPOINT,
};
