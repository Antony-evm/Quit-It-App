import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StytchProvider, StytchClient } from '@stytch/react-native';
import Config from 'react-native-config';

import { BACKGROUND } from '@/shared/theme';
import { AppNavigator } from '@/navigation';
import { NavigationReadyProvider } from '@/navigation/NavigationContext';
import { useTrackingTypesPrefetch } from '@/features/tracking';
import { ToastProvider, ToastContainer } from '@/shared/components/toast';
import { AuthProvider } from '@/shared/auth';
import { ErrorHandlerProvider, GlobalErrorBoundary } from '@/shared/error';
import { DeveloperMenuTrigger } from '@/shared/components/dev';

// Initialize Stytch client once at module level
const stytchToken = Config.STYTCH_PUBLIC_TOKEN || 'public-token-placeholder';

if (!Config.STYTCH_PUBLIC_TOKEN) {
  console.error(
    'STYTCH_PUBLIC_TOKEN is not configured. Please add it to your .env file.',
  );
}

const stytchClient = new StytchClient(stytchToken);

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

/**
 * Inner app content that has access to all providers.
 * Runs hooks that need provider context.
 */
function AppContent(): React.ReactElement {
  useTrackingTypesPrefetch();

  return (
    <ToastProvider>
      <ErrorHandlerProvider preferToast={true}>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={BACKGROUND.muted}
          />
          <AppNavigator />
          <ToastContainer />
          {__DEV__ && <DeveloperMenuTrigger />}
        </SafeAreaProvider>
      </ErrorHandlerProvider>
    </ToastProvider>
  );
}

function App(): React.ReactElement {
  return (
    <GlobalErrorBoundary>
      <StytchProvider stytch={stytchClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationReadyProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </NavigationReadyProvider>
        </QueryClientProvider>
      </StytchProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
