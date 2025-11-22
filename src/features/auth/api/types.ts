import { UserAuthenticationMethod } from '../types';
import { UserDataResponse } from '@/shared/types/api';

export interface CreateUserPayload {
  first_name?: string | null;
  last_name?: string | null;
  email: string;
  stytch_user_id: string;
  user_authentication_method: UserAuthenticationMethod;
}

export interface CreateUserResponse extends UserDataResponse {}

export interface LoginUserPayload {
  stytch_user_id: string;
  email: string;
  methodology: 'email+password' | 'google' | 'apple' | 'magic_link' | string;
}

export interface LoginUserResponse extends UserDataResponse {}
