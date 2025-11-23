import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/navigation';
import { QuestionnaireScreen } from '@/features/questionnaire/screens/QuestionnaireScreen';
import { HomeScreen } from '@/features/home/screens/HomeScreen';
import { AuthScreen } from '@/features/auth';
import { PaywallScreen } from '@/features/paywall';
import { StartupNavigationHandler } from '@/shared/components/StartupNavigationHandler';
import { useNavigationReady } from '@/navigation/NavigationContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { setReady } = useNavigationReady();

  return (
    <NavigationContainer
      onReady={() => {
        console.log(
          '[Navigation] Navigation container is ready, calling setReady()',
        );
        setReady();
      }}
    >
      <StartupNavigationHandler>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="Auth"
            component={AuthScreen}
            options={{
              gestureEnabled: false, // Prevent swipe back from auth
            }}
          />
          <Stack.Screen
            name="Questionnaire"
            component={QuestionnaireScreen}
            options={{
              gestureEnabled: false, // Prevent swipe back from questionnaire
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              gestureEnabled: false, // Prevent swipe back from paywall (unskippable)
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              gestureEnabled: false, // Prevent swipe back to questionnaire once completed
            }}
          />
        </Stack.Navigator>
      </StartupNavigationHandler>
    </NavigationContainer>
  );
};
