import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton, AppSurface, AppText } from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';
import { useDeviceDimensions } from '@/shared/hooks/useDeviceDimensions';
import {
  QUESTIONNAIRE_HORIZONTAL_PADDING,
  QUESTIONNAIRE_MAX_CONTENT_WIDTH,
} from '@/shared/theme/layout';

type QuestionnaireTemplateProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  onPrimaryActionPress?: () => void;
  footerSlot?: React.ReactNode;
  backButton?: React.ReactNode;
}>;

export const QuestionnaireTemplate = ({
  title,
  subtitle,
  isLoading = false,
  primaryActionLabel,
  primaryActionDisabled = false,
  onPrimaryActionPress,
  footerSlot,
  backButton,
  children,
}: QuestionnaireTemplateProps) => {
  const { width } = useDeviceDimensions();
  const safeWidth = Math.max(width, 320);
  const contentWidth = Math.min(
    safeWidth - QUESTIONNAIRE_HORIZONTAL_PADDING * 2,
    QUESTIONNAIRE_MAX_CONTENT_WIDTH,
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: QUESTIONNAIRE_HORIZONTAL_PADDING },
        ]}
        style={styles.scrollView}
        testID="questionnaire-template"
      >
        <View style={styles.backButtonContainer}>{backButton}</View>

        <View style={[styles.container, { maxWidth: contentWidth }]}>
          {!isLoading ? (
            <View style={styles.hero}>
              <View style={styles.heroText}>
                <AppText variant="title">{title}</AppText>
                {subtitle ? (
                  <AppText tone="primary" style={styles.subtitle}>
                    {subtitle}
                  </AppText>
                ) : null}
              </View>
            </View>
          ) : null}
          <AppSurface style={styles.body}>
            {isLoading ? (
              <View style={styles.loading}>
                <ActivityIndicator
                  size="large"
                  color={COLOR_PALETTE.accentPrimary}
                />
                <AppText tone="primary" style={styles.loadingLabel}>
                  Loading your next question...
                </AppText>
              </View>
            ) : (
              children
            )}
          </AppSurface>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        {primaryActionLabel ? (
          <AppButton
            label={primaryActionLabel}
            variant="primary"
            onPress={onPrimaryActionPress}
            disabled={primaryActionDisabled}
            containerStyle={styles.primaryAction}
            fullWidth
          />
        ) : null}
        {footerSlot}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: BRAND_COLORS.inkDark,
  },
  scrollView: {
    flex: 1,
    backgroundColor: BRAND_COLORS.inkDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.xs, // Even smaller top padding
    paddingBottom: SPACING.xxl,
    gap: SPACING.xs, // Very small gap between sections
  },
  container: {
    gap: SPACING.md, // Very small gap between container elements
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    borderRadius: 0,
    paddingVertical: SPACING.md,
    overflow: 'hidden',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderWidth: 0,
  },
  heroAccent: {
    position: 'absolute',
    right: -40,
    top: -40,
    borderRadius: 999,
    backgroundColor: COLOR_PALETTE.accentMuted,
    opacity: 0.35,
  },
  heroText: {
    gap: SPACING.lg,
  },
  subtitle: {},
  body: {
    gap: SPACING.lg,
    padding: 0,
    paddingHorizontal: 0, // Explicitly override AppSurface horizontal padding
    paddingVertical: SPACING.xl,
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: BRAND_COLORS.inkDark,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowOffset: { width: 0, height: 0 },
    elevation: 0,
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
    paddingTop: SPACING.lg,
    paddingHorizontal: QUESTIONNAIRE_HORIZONTAL_PADDING,
    paddingBottom: SPACING.lg,
    width: '100%',
    backgroundColor: BRAND_COLORS.inkDark,
  },
  backButtonContainer: {
    position: 'relative',
    height: 60, // Reduced height
    width: '100%',
    marginBottom: 0, // No margin at all
  },
  primaryAction: {},
});
