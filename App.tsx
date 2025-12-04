import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { StytchProvider, StytchClient } from '@stytch/react-native';
import Config from 'react-native-config';

import { BACKGROUND } from '@/shared/theme';
import { AppNavigator } from '@/navigation';
import { NavigationReadyProvider } from '@/navigation/NavigationContext';
import {
  ToastProvider,
  ToastContainer,
  useToast,
} from '@/shared/components/toast';
import { AuthProvider } from '@/shared/auth';
import { GlobalErrorBoundary } from '@/shared/error';
import { DeveloperMenuTrigger } from '@/shared/components/dev';
import { apiClient } from '@/shared/api/apiConfig';
import { queryClient } from '@/shared/api/queryClient';

// Initialize Stytch client once at module level
const stytchToken = Config.STYTCH_PUBLIC_TOKEN || 'public-token-placeholder';

if (!Config.STYTCH_PUBLIC_TOKEN) {
  console.error(
    'STYTCH_PUBLIC_TOKEN is not configured. Please add it to your .env file.',
  );
}

const stytchClient = new StytchClient(stytchToken);

/**
 * Inner app content that has access to all providers.
 * Runs hooks that need provider context.
 */
function AppContent(): React.ReactElement {
  const { showToast } = useToast();

  // Set up the toast function for API error handling
  React.useEffect(() => {
    apiClient.setToastFunction(showToast);
  }, [showToast]);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={BACKGROUND.muted} />
      <AppNavigator />
      <ToastContainer />
      {__DEV__ && <DeveloperMenuTrigger />}
    </SafeAreaProvider>
  );
}

function App(): React.ReactElement {
  return (
    <GlobalErrorBoundary>
      <StytchProvider stytch={stytchClient}>
        <QueryClientProvider client={queryClient}>
          <NavigationReadyProvider>
            <AuthProvider>
              <ToastProvider>
                <AppContent />
              </ToastProvider>
            </AuthProvider>
          </NavigationReadyProvider>
        </QueryClientProvider>
      </StytchProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
