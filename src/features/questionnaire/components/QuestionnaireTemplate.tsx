import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton, AppSurface, AppText } from '../../../shared/components/ui';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';

type QuestionnaireTemplateProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  onPrimaryActionPress?: () => void;
  footerSlot?: React.ReactNode;
}>;

export const QuestionnaireTemplate = ({
  title,
  subtitle,
  isLoading = false,
  primaryActionLabel,
  primaryActionDisabled = false,
  onPrimaryActionPress,
  footerSlot,
  children,
}: QuestionnaireTemplateProps) => (
  <ScrollView
    contentContainerStyle={styles.scrollContent}
    style={styles.scrollView}
    testID="questionnaire-template">
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="title">{title}</AppText>
        {subtitle ? (
          <AppText tone="secondary" style={styles.subtitle}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      <AppSurface style={styles.body}>
        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={COLOR_PALETTE.accentPrimary} />
            <AppText tone="secondary" style={styles.loadingLabel}>
              Loading your next question...
            </AppText>
          </View>
        ) : (
          children
        )}
      </AppSurface>
    </View>
    <View style={styles.footer}>
      {primaryActionLabel ? (
        <AppButton
          label={primaryActionLabel}
          onPress={onPrimaryActionPress}
          disabled={primaryActionDisabled}
          containerStyle={styles.primaryAction}
        />
      ) : null}
      {footerSlot}
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    justifyContent: 'space-between',
    gap: SPACING.xxl,
  },
  container: {
    gap: SPACING.xl,
  },
  header: {
    gap: SPACING.sm,
  },
  subtitle: {
    marginTop: SPACING.xs,
  },
  body: {
    gap: SPACING.lg,
  },
  loading: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingLabel: {
    textAlign: 'center',
  },
  footer: {
    gap: SPACING.md,
  },
  primaryAction: {
    width: '100%',
  },
});
