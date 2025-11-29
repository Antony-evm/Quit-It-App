import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from './useSubscription';
import { useUserStatusUpdate } from '@/shared/hooks';
import { RootStackNavigationProp } from '@/types/navigation';

export const usePaywallLogic = () => {
  const navigation = useNavigation<RootStackNavigationProp<'Paywall'>>();
  const { handleUserStatusUpdateWithNavigation } = useUserStatusUpdate();
  const { mutateAsync: subscribe, isPending: isSubscribing } =
    useSubscription();

  const handleSubscribe = async () => {
    try {
      const response = await subscribe();

      // Update user status and handle navigation using the centralized hook
      await handleUserStatusUpdateWithNavigation(response, navigation);

      // Show success message
      Alert.alert('Success!', response.message || 'Successfully subscribed!', [
        { text: 'OK' },
      ]);
    } catch (error) {
      Alert.alert(
        'Subscription Failed',
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
        [{ text: 'OK' }],
      );
    }
  };

  return {
    handleSubscribe,
    isSubscribing,
  };
};
