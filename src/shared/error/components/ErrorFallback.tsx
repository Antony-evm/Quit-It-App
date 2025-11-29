import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { AppText } from '../../components/ui/AppText';
import { AppButton } from '../../components/ui/AppButton';
import { COLOR_PALETTE, SPACING } from '../../theme';

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
      <View style={styles.content}>
        <AppText variant="title" style={styles.title}>
          Oops!
        </AppText>
        <AppText variant="body" style={styles.message}>
          Something went wrong. We're sorry for the inconvenience.
        </AppText>

        {__DEV__ && (
          <View style={styles.debugInfo}>
            <AppText variant="caption" style={styles.errorText}>
              {error.toString()}
            </AppText>
          </View>
        )}

        <AppButton
          label="Try Again"
          onPress={resetError}
          variant="primary"
          size="md"
          fullWidth
          containerStyle={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    padding: SPACING.xl,
    alignItems: 'center',
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
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.xl,
    width: '100%',
  },
  errorText: {
    color: COLOR_PALETTE.systemError,
  },
  button: {
    marginTop: SPACING.md,
  },
});
