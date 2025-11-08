import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLOR_PALETTE } from './src/shared/theme';
import { QuestionnaireScreen } from './src/features/questionnaire';
import { DebugLogConsole } from './src/shared/components/dev/DebugLogConsole';
import { HomePlaceholderScreen } from './src/features/home/screens/HomePlaceholderScreen';

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
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={statusBarStyle}
          backgroundColor={COLOR_PALETTE.backgroundMuted}
        />
        {hasCompletedQuestionnaire ? (
          <HomePlaceholderScreen
            onStartOver={() => {
              setHasCompletedQuestionnaire(false);
            }}
          />
        ) : (
          <QuestionnaireScreen
            onFinish={() => {
              setHasCompletedQuestionnaire(true);
            }}
          />
        )}
        <DebugLogConsole />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
