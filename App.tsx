import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StytchProvider, StytchClient } from '@stytch/react-native';
import Config from 'react-native-config';

import { COLOR_PALETTE } from '@/shared/theme';
import { AppNavigator } from '@/navigation';
import { NavigationReadyProvider } from '@/navigation/NavigationContext';
import { TrackingTypesProvider } from '@/features/tracking/components/TrackingTypesProvider';
import { QuestionnaireAccountProvider } from '@/features/questionnaire';
import { ToastProvider, ToastContainer } from '@/shared/components/toast';
import { AuthProvider } from '@/shared/auth';
import { ErrorHandlerProvider, GlobalErrorBoundary } from '@/shared/error';
import { DeveloperMenuTrigger } from '@/shared/components/dev';

// Initialize Stytch client once at module level
if (!Config.STYTCH_PUBLIC_TOKEN) {
  throw new Error(
    'STYTCH_PUBLIC_TOKEN is not configured. Please add it to your .env file.',
  );
}

const stytchClient = new StytchClient(Config.STYTCH_PUBLIC_TOKEN);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App(): React.ReactElement {
  return (
    <StytchProvider stytch={stytchClient}>
      <QueryClientProvider client={queryClient}>
        <NavigationReadyProvider>
          <AuthProvider>
            <TrackingTypesProvider>
              <QuestionnaireAccountProvider>
                <ToastProvider>
                  <ErrorHandlerProvider preferToast={true}>
                    <GlobalErrorBoundary>
                      <SafeAreaProvider>
                        <StatusBar
                          barStyle="light-content"
                          backgroundColor={COLOR_PALETTE.backgroundMuted}
                        />
                        <AppNavigator />
                        <ToastContainer />
                        {__DEV__ && <DeveloperMenuTrigger />}
                      </SafeAreaProvider>
                    </GlobalErrorBoundary>
                  </ErrorHandlerProvider>
                </ToastProvider>
              </QuestionnaireAccountProvider>
            </TrackingTypesProvider>
          </AuthProvider>
        </NavigationReadyProvider>
      </QueryClientProvider>
    </StytchProvider>
  );
}

export default App;
