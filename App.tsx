import React, { useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { COLOR_PALETTE } from './src/shared/theme';
import { QuestionnaireScreen } from './src/features/questionnaire';
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
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] =
    useState(false);

  // Removed colorScheme.set('dark') as it was causing the blank screen issue

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor={COLOR_PALETTE.backgroundMuted}
        />
        <SafeAreaView
          edges={['top', 'left', 'right']}
          style={{ flex: 1, backgroundColor: COLOR_PALETTE.backgroundMuted }}
        >
          <View
            style={{ flex: 1, backgroundColor: COLOR_PALETTE.backgroundMuted }}
          >
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
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;
