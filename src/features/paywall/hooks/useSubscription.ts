import { useMutation } from '@tanstack/react-query';
import { subscribeUser } from '../api/subscriptionApi';

export const useSubscription = () => {
  return useMutation({
    mutationFn: subscribeUser,
  });
};
