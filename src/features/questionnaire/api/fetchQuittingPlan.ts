import { authenticatedGet } from '@/shared/api/apiConfig';
import type { QuittingPlanResponse, QuittingPlan } from '../types/plan';
import { QUESTIONNAIRE_PLAN_ENDPOINT } from './endpoints';

export interface FetchQuittingPlanResponse {
  data: QuittingPlanResponse;
}

/**
 * Fetch the user's quitting plan from the questionnaire endpoint
 */
export const fetchQuittingPlan = async (): Promise<QuittingPlan> => {
  const response = await authenticatedGet(QUESTIONNAIRE_PLAN_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch quitting plan: ${response.status}`);
  }

  const responseData: FetchQuittingPlanResponse = await response.json();
  const planData = responseData.data;

  // Convert the response to our internal format
  const plan: QuittingPlan = {
    date: new Date(planData.date),
    status: planData.status,
    current: planData.current,
    target: planData.target,
    text: planData.text,
  };

  return plan;
};
