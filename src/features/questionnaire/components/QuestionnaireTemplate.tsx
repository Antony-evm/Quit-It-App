import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppButton, Box, ScreenHeader } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import {
  DEVICE_WIDTH,
  QUESTIONNAIRE_HORIZONTAL_PADDING,
} from '@/shared/theme/layout';
import { QuestionnaireProgressBar } from './QuestionnaireProgressBar';
import { QuestionnaireSkeleton, SkeletonItem } from './QuestionnaireSkeleton';

type QuestionnaireTemplateProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  onPrimaryActionPress?: () => void;
  footerSlot?: React.ReactNode;
  backButton?: React.ReactNode;
  progressData?: {
    currentQuestion: number;
    totalQuestions: number;
  };
}>;

export const QuestionnaireTemplate = ({
  title,
  subtitle,
  isLoading = false,
  isSubmitting = false,
  primaryActionLabel,
  primaryActionDisabled = false,
  onPrimaryActionPress,
  footerSlot,
  backButton,
  progressData,
  children,
}: QuestionnaireTemplateProps) => {
  return (
    <Box style={styles.wrapper}>
      <Box style={styles.headerContainer}>
        <Box style={styles.backButtonSection}>{backButton}</Box>
        <Box style={styles.progressSection}>
          {progressData ? (
            <QuestionnaireProgressBar
              currentQuestion={progressData.currentQuestion}
              totalQuestions={progressData.totalQuestions}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          ) : isLoading ? (
            <Box style={styles.container}>
              <SkeletonItem width={40} height={14} />
              <SkeletonItem width="100%" height={6} />
            </Box>
          ) : null}
        </Box>
      </Box>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
        testID="questionnaire-template"
      >
        <Box style={styles.container}>
          {!isLoading ? (
            <Box>
              <ScreenHeader title={title} subtitle={subtitle} />
            </Box>
          ) : null}
          <Box>{isLoading ? <QuestionnaireSkeleton /> : children}</Box>
        </Box>
      </ScrollView>
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
    </Box>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    paddingHorizontal: QUESTIONNAIRE_HORIZONTAL_PADDING,
    paddingTop: SPACING.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  container: {
    gap: SPACING.xl,
    width: '100%',
  },
  hero: {
    borderRadius: 0,
    paddingVertical: SPACING.md,
    overflow: 'hidden',
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
  loading: {
    alignItems: 'center',
    gap: SPACING.sm,
  },
  loadingLabel: {
    textAlign: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    width: '100%',
    marginBottom: SPACING.xxl,
  },
  backButtonSection: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: SPACING.md,
    position: 'relative',
  },
  progressSection: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: DEVICE_WIDTH / 7,
  },
  backButtonContainer: {
    position: 'relative',
    height: 60,
    width: '100%',
    marginBottom: 0,
  },
  primaryAction: {},
});
