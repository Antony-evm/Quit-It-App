import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLOR_PALETTE } from './src/shared/theme';
import { QuestionnaireScreen } from './src/features/questionnaire';

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
  const isDarkMode = useColorScheme() === 'dark';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={COLOR_PALETTE.backgroundMuted}
        />
        <QuestionnaireScreen />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
