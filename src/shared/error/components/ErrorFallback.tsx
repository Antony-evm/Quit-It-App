import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { AppText, AppButton, Box } from '../../components/ui';
import { BACKGROUND, SYSTEM, SPACING, BORDER_RADIUS } from '../../theme';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
}) => {
  return (
    <SafeAreaView style={styles.container}>
      <Box p="xl" alignItems="center" style={styles.content}>
        <AppText variant="title" style={styles.title}>
          Oops!
        </AppText>
        <AppText variant="body" style={styles.message}>
          Something went wrong. We're sorry for the inconvenience.
        </AppText>

        {__DEV__ && (
          <Box p="md" mb="xl" borderRadius="small" style={styles.debugInfo}>
            <AppText variant="caption" style={styles.errorText}>
              {error.toString()}
            </AppText>
          </Box>
        )}

        <AppButton
          label="Try Again"
          onPress={resetError}
          variant="primary"
          size="md"
          fullWidth
          containerStyle={styles.button}
        />
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    marginBottom: SPACING.xl,
    textAlign: 'center',
    opacity: 0.8,
  },
  debugInfo: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  errorText: {
    color: SYSTEM.error,
  },
  button: {
    marginTop: SPACING.md,
  },
});
