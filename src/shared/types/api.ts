/**
 * Common API response interface for operations that return user data
 */
export interface UserDataResponse {
  data: {
    user_id: number;
    user_status_id: number;
  };
  success?: boolean;
  message?: string;
}
