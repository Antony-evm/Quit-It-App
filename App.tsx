import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { COLOR_PALETTE } from './src/shared/theme';
import { QuestionnaireScreen } from './src/features/questionnaire';

function App(): React.ReactElement {
  const isDarkMode = useColorScheme() === 'dark';
  const statusBarStyle = isDarkMode ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={COLOR_PALETTE.backgroundMuted}
      />
      <QuestionnaireScreen />
    </SafeAreaProvider>
  );
}

export default App;
