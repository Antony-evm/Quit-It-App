import { apiPost } from '@/shared/api/apiConfig';
import { QUESTIONNAIRE_COMPLETE_ENDPOINT } from './endpoints';
import type { QuestionnaireCompleteResponse } from '../types';

export async function completeQuestionnaire(): Promise<QuestionnaireCompleteResponse> {
  const response = await apiPost(QUESTIONNAIRE_COMPLETE_ENDPOINT);

  if (!response.ok) {
    throw new Error('Failed to complete questionnaire');
  }

  return response.json();
}
