import { apiGet } from '@/shared/api/apiConfig';
import type { FetchReviewResponse } from '../types';
import { QUESTIONNAIRE_REVIEW_ENDPOINT } from './endpoints';

/**
 * Fetch the questionnaire review data (list of [title, text] tuples).
 */
export const fetchQuestionnaireReview = async (): Promise<
  [string, string][]
> => {
  const response = await apiGet(QUESTIONNAIRE_REVIEW_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch questionnaire review: ${response.status}`);
  }

  const responseData: FetchReviewResponse = await response.json();
  // Convert review_items array to [title, text] tuples
  return responseData.data.review_items.map(item => [item.title, item.text]);
};
