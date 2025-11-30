import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { RootStackParamList } from '@/types/navigation';
import { QuestionnaireScreen } from '@/features/questionnaire/screens/QuestionnaireScreen';
import { HomeTabNavigator } from '@/navigation/HomeTabNavigator';
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
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Questionnaire"
            component={QuestionnaireScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              gestureEnabled: false,
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={HomeTabNavigator}
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </StartupNavigationHandler>
    </NavigationContainer>
  );
};
