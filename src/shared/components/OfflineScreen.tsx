import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Box, AppText, AppButton } from '@/shared/components/ui';
import { TEXT, SPACING, TYPOGRAPHY } from '@/shared/theme';

interface OfflineScreenProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * Screen displayed when the app is offline or cannot reach the backend
 */
export const OfflineScreen: React.FC<OfflineScreenProps> = ({
  onRetry,
  message = "We couldn't connect to our servers. Please check your internet connection and try again.",
}) => {
  return (
    <Box
      style={styles.container}
      justifyContent="center"
      alignItems="center"
      bg="primary"
    >
      <View style={styles.content}>
        {/* Offline icon placeholder - you can add an icon here */}

        <AppText style={styles.title}>You're Offline</AppText>

        <AppText style={styles.message}>{message}</AppText>

        {onRetry && <AppButton label="Try Again" onPress={onRetry} />}
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    elevation: 3,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: SPACING.xxl,
  },
  iconContainer: {
    marginBottom: SPACING.xl,
  },
  iconText: {
    fontSize: TYPOGRAPHY.display.fontSize * 1.5,
  },
  title: {
    fontSize: TYPOGRAPHY.heading.fontSize,
    fontWeight: 'bold',
    color: TEXT.primary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  message: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    color: TEXT.subtitle,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.body.lineHeight,
    marginBottom: SPACING.xxl,
  },
});
