import { authenticatedGet } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_ACCOUNT_ENDPOINT } from './endpoints';

export interface QuestionnaireAccountResponse {
  data: number[];
}

export const fetchQuestionnaireAccountData = async (): Promise<number[]> => {
  const response = await authenticatedGet(QUESTIONNAIRE_ACCOUNT_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to load questionnaire account data');
  }

  const payload = (await response.json()) as QuestionnaireAccountResponse;
  return payload.data;
};
