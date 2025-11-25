/**
 * Common API response interface for operations that return user data
 */
export interface UserDataResponse {
  data: {
    user_id: number;
    user_status_id: number;
    user_type_id: number;
    first_name: string | null;
    last_name: string | null;
  };
  success?: boolean;
  message?: string;
}
