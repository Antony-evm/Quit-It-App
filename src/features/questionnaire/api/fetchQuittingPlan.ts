import { authenticatedGet, authenticatedPost } from '@/shared/api/apiConfig';
import type { QuittingPlanResponse, QuittingPlan } from '../types';
import { QUESTIONNAIRE_PLAN_ENDPOINT } from './endpoints';

export interface FetchQuittingPlanResponse {
  data: QuittingPlanResponse;
}

/**
 * Fetch the user's quitting plan from the questionnaire endpoint
 */
export const fetchQuittingPlan = async (
  userId: number,
): Promise<QuittingPlan> => {
  if (!userId) {
    throw new Error('User ID not available');
  }

  const queryParams = new URLSearchParams({
    user_id: userId.toString(),
  });
  const url = `${QUESTIONNAIRE_PLAN_ENDPOINT}?${queryParams}`;

  const response = await authenticatedGet(url);

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

/**
 * Generate the user's quitting plan from the questionnaire endpoint
 */
export const generateQuittingPlan = async (
  userId: number,
): Promise<QuittingPlan> => {
  if (!userId) {
    throw new Error('User ID not available');
  }

  const queryParams = new URLSearchParams({
    user_id: userId.toString(),
  });
  const url = `${QUESTIONNAIRE_PLAN_ENDPOINT}?${queryParams}`;

  const response = await authenticatedPost(url, {});

  if (!response.ok) {
    throw new Error(`Failed to generate quitting plan: ${response.status}`);
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
