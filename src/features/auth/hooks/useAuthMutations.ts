import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useErrorHandler } from '@/shared/error';
import { createUser, loginUser } from '../api';
import type { CreateUserPayload, LoginUserPayload } from '../api/types';

export const useLoginMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginUserPayload) => loginUser(payload),
    onSuccess: data => {
      // Login response received
      console.log('[useLoginMutation] Login successful:', data);

      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
    onError: error => {
      console.error('[useLoginMutation] Login failed:', error);
      handleError(error, {
        context: { operation: 'login' },
        showToast: true,
      });
    },
  });
};

export const useSignupMutation = () => {
  const { handleError } = useErrorHandler();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: data => {
      console.log('[useSignupMutation] Signup successful:', data);

      // Invalidate any user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: error => {
      console.error('[useSignupMutation] Signup failed:', error);
      handleError(error, {
        context: { operation: 'signup' },
        showToast: true,
      });
    },
  });
};

// Combined auth operations hook for convenience
export const useAuthMutations = () => {
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  return {
    login: loginMutation,
    signup: signupMutation,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    error: loginMutation.error || signupMutation.error,
  };
};
