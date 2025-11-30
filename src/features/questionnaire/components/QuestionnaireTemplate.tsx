import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppButton, Box, ScreenHeader } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
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
    <Box variant="default">
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
            <Box>
              <SkeletonItem width={40} height={14} />
              <SkeletonItem width="100%" height={6} />
            </Box>
          ) : null}
        </Box>
      </Box>

      <ScrollView testID="questionnaire-template">
        <Box variant="default">
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: SPACING.md,
    minHeight: 44,
  },
  backButtonSection: {
    width: 44,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'flex-start',
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  progressSection: {
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  primaryAction: {},
});
