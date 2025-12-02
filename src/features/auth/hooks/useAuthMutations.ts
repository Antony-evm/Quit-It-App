import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUser, loginUser } from '../api';
import type { CreateUserPayload, LoginUserPayload } from '../api/types';

export const useLoginMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: (payload: LoginUserPayload) => loginUser(payload),
    onSuccess: () => {
      // Invalidate all user-related queries to refetch fresh data after login
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['trackingRecords'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });
};

export const useSignupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['auth', 'signup'],
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      // Invalidate all user-related queries to refetch fresh data after signup
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['account'] });
    },
  });
};

// Combined auth operations hook for convenience
export const useAuthMutations = () => {
  const loginMutation = useLoginMutation();
  const signupMutation = useSignupMutation();

  const reset = () => {
    loginMutation.reset();
    signupMutation.reset();
  };

  return {
    login: loginMutation,
    signup: signupMutation,
    isLoading: loginMutation.isPending || signupMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
    reset,
  };
};
