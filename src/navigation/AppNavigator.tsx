import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/navigation';
import { QuestionnaireScreen } from '@/features/questionnaire/screens/QuestionnaireScreen';
import { HomeTabNavigator } from '@/features/home/screens/HomeTabNavigator';
import { AuthScreen } from '@/features/auth';
import { PaywallScreen } from '@/features/paywall';
import { StartupNavigationHandler } from '@/shared/components/StartupNavigationHandler';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { useNavigationReady } from '@/navigation/NavigationContext';
import { navigationRef } from '@/navigation/navigationRef';

const Stack = createNativeStackNavigator<RootStackParamList>();
const StartupLoadingScreen = () => <LoadingScreen />;

export const AppNavigator = () => {
  const { setReady } = useNavigationReady();

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        console.log('[AppNavigator] Navigation container is ready');
        setReady();
      }}
    >
      <StartupNavigationHandler>
        <Stack.Navigator
          initialRouteName="StartupLoading"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        >
          <Stack.Screen
            name="StartupLoading"
            component={StartupLoadingScreen}
            options={{
              gestureEnabled: false,
              animation: 'fade',
            }}
          />
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
            component={HomeTabNavigator}
            options={{
              gestureEnabled: false, // Prevent swipe back to questionnaire once completed
            }}
          />
        </Stack.Navigator>
      </StartupNavigationHandler>
    </NavigationContainer>
  );
};
