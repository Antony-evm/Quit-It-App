import { API_BASE_URL } from '../../../shared/api/apiConfig';

export const QUESTIONNAIRE_ENDPOINT = `${API_BASE_URL}/api/v1/questionnaire`;
export const QUESTIONNAIRE_ANSWER_ENDPOINT = `${QUESTIONNAIRE_ENDPOINT}/answer`;

export const QUESTIONNAIRE_DEFAULT_PARAMS = {
  orderId: 0,
  variationId: 0,
};

export const QUESTIONNAIRE_PLACEHOLDERS = {
  orderId: QUESTIONNAIRE_DEFAULT_PARAMS.orderId,
  variationId: QUESTIONNAIRE_DEFAULT_PARAMS.variationId,
  endpoint: QUESTIONNAIRE_ENDPOINT,
};
