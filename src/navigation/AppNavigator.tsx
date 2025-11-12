import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/navigation';
import { QuestionnaireScreen } from '@/features/questionnaire/screens/QuestionnaireScreen';
import { HomePlaceholderScreen } from '@/features/home/screens/HomePlaceholderScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Questionnaire"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Questionnaire"
          component={QuestionnaireScreen}
          options={{
            gestureEnabled: false, // Prevent swipe back from questionnaire
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomePlaceholderScreen}
          options={{
            gestureEnabled: false, // Prevent swipe back to questionnaire once completed
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
