import React, { PropsWithChildren } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton, AppSurface, AppText } from '../../../shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '../../../shared/theme';
import { useDeviceDimensions } from '../../../shared/hooks/useDeviceDimensions';

type QuestionnaireTemplateProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  eyebrowLabel?: string;
  isLoading?: boolean;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  onPrimaryActionPress?: () => void;
  footerSlot?: React.ReactNode;
}>;

export const QuestionnaireTemplate = ({
  title,
  subtitle,
  eyebrowLabel = 'Daily check-in',
  isLoading = false,
  primaryActionLabel,
  primaryActionDisabled = false,
  onPrimaryActionPress,
  footerSlot,
  children,
}: QuestionnaireTemplateProps) => {
  const { width } = useDeviceDimensions();
  const safeWidth = Math.max(width, 320);
  const isCompactLayout = safeWidth < 400;
  const horizontalPadding = isCompactLayout ? SPACING.lg : SPACING.xl;
  const maxContentWidth = Math.min(safeWidth - horizontalPadding * 2, 760);
  const heroAccentSize = Math.min(Math.max(safeWidth * 0.35, 140), 220);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: horizontalPadding },
      ]}
      style={styles.scrollView}
      testID="questionnaire-template">
      <View style={[styles.container, { maxWidth: maxContentWidth }]}>
        <View style={styles.hero}>
          <View
            style={[
              styles.heroAccent,
              { width: heroAccentSize, height: heroAccentSize },
            ]}
          />
          <View style={styles.heroBadge}>
            <AppText variant="caption" tone="inverse" style={styles.heroBadgeLabel}>
              {eyebrowLabel.toUpperCase()}
            </AppText>
          </View>
          <View style={styles.heroText}>
            <AppText variant="title">{title}</AppText>
            {subtitle ? (
              <AppText tone="secondary" style={styles.subtitle}>
                {subtitle}
              </AppText>
            ) : null}
          </View>
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
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: BRAND_COLORS.inkDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: SPACING.xxl,
    justifyContent: 'space-between',
    gap: SPACING.xxl,
  },
  container: {
    gap: SPACING.xl,
    width: '100%',
    alignSelf: 'center',
  },
  hero: {
    borderRadius: 28,
    padding: SPACING.xl,
    overflow: 'hidden',
    backgroundColor: COLOR_PALETTE.backgroundPrimary,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
  },
  heroAccent: {
    position: 'absolute',
    right: -40,
    top: -40,
    borderRadius: 999,
    backgroundColor: COLOR_PALETTE.accentMuted,
    opacity: 0.35,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 999,
    backgroundColor: COLOR_PALETTE.accentPrimary,
    marginBottom: SPACING.md,
  },
  heroBadgeLabel: {
    letterSpacing: 1,
  },
  heroText: {
    gap: SPACING.xs,
  },
  subtitle: {
    marginTop: SPACING.xs,
  },
  body: {
    gap: SPACING.lg,
    padding: SPACING.xl,
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
    borderTopWidth: 1,
    borderTopColor: COLOR_PALETTE.borderDefault,
    paddingTop: SPACING.lg,
  },
  primaryAction: {
    width: '100%',
  },
});
