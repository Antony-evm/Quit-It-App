import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLOR_PALETTE } from './src/shared/theme';
import { AppNavigator } from './src/navigation';
import { TrackingTypesProvider } from './src/features/tracking/components/TrackingTypesProvider';
import { ToastProvider, ToastContainer } from './src/shared/components/toast';

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
  );
}

export default App;
