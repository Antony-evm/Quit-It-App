import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StytchProvider, StytchClient } from '@stytch/react-native';
import Config from 'react-native-config';

import { COLOR_PALETTE } from './src/shared/theme';
import { AppNavigator } from './src/navigation';
import { TrackingTypesProvider } from './src/features/tracking/components/TrackingTypesProvider';
import { ToastProvider, ToastContainer } from './src/shared/components/toast';

// Initialize Stytch client
const stytchClient = new StytchClient(
  'public-token-test-bff8e9c7-cb62-4afd-8e6d-1dbce527efdd',
);

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
        <TrackingTypesProvider>
          <ToastProvider>
            <SafeAreaProvider>
              <StatusBar
                barStyle="light-content"
                backgroundColor={COLOR_PALETTE.backgroundMuted}
              />
              <AppNavigator />
              <ToastContainer />
            </SafeAreaProvider>
          </ToastProvider>
        </TrackingTypesProvider>
      </QueryClientProvider>
    </StytchProvider>
  );
}

export default App;
