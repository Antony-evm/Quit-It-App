import { apiGet, apiPost } from '@/shared/api/apiConfig';
import type {
  QuittingPlanResponse,
  QuittingPlan,
  FetchQuittingPlanResponse,
} from '../types';
import { QUESTIONNAIRE_PLAN_ENDPOINT } from './endpoints';

const transformPlanResponse = (
  planData: QuittingPlanResponse,
): QuittingPlan => {
  const datetime = new Date(planData.datetime);
  if (isNaN(datetime.getTime())) {
    throw new Error(`Invalid datetime received: ${planData.datetime}`);
  }
  return {
    datetime,
    status: planData.status,
    current: planData.current,
    target: planData.target,
    text: planData.text,
  };
};

/**
 * Fetch the user's quitting plan from the questionnaire endpoint
 */
export const fetchQuittingPlan = async (): Promise<QuittingPlan> => {
  const response = await apiGet(QUESTIONNAIRE_PLAN_ENDPOINT);

  if (!response.ok) {
    throw new Error(`Failed to fetch quitting plan: ${response.status}`);
  }

  const responseData: FetchQuittingPlanResponse = await response.json();
  return transformPlanResponse(responseData.data);
};

/**
 * Generate the user's quitting plan from the questionnaire endpoint.
 * This triggers plan generation on the backend.
 */
export const generateQuittingPlan = async (): Promise<void> => {
  const response = await apiPost(QUESTIONNAIRE_PLAN_ENDPOINT, {});

  if (!response.ok) {
    throw new Error(`Failed to generate quitting plan: ${response.status}`);
  }
};
