import { UserAuthenticationMethod } from '../types';

export interface CreateUserPayload {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  stytch_user_id: string;
  user_authentication_method: UserAuthenticationMethod;
}

export interface CreateUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}

export interface LoginUserPayload {
  stytch_user_id: string;
  email: string;
  methodology: 'email+password' | 'google' | 'apple' | 'magic_link' | string;
}

export interface LoginUserResponse {
  data: {
    user_id: number;
  };
  success?: boolean;
  message?: string;
}
