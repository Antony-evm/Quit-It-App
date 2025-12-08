import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import { AppButton, Box, ScreenHeader } from '@/shared/components/ui';
import { SPACING } from '@/shared/theme';
import { QuestionnaireProgressBar } from './QuestionnaireProgressBar';
import { SkeletonItem } from './QuestionnaireSkeleton';

type QuestionnaireTemplateProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  isLoading?: boolean;
  isSubmitting?: boolean;
  primaryActionLabel?: string;
  primaryActionDisabled?: boolean;
  onPrimaryActionPress?: () => void;
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
  backButton,
  progressData,
  children,
}: QuestionnaireTemplateProps) => {
  return (
    <Box variant="default">
      <Box style={styles.headerContainer}>
        {backButton && <Box style={styles.backButtonSection}>{backButton}</Box>}
        <Box style={styles.progressSection}>
          {progressData ? (
            <Box style={{ width: '40%' }}>
              <QuestionnaireProgressBar
                currentQuestion={progressData.currentQuestion}
                totalQuestions={progressData.totalQuestions}
                isLoading={isLoading}
                isSubmitting={isSubmitting}
              />
            </Box>
          ) : isLoading ? (
            <Box style={{ width: '40%' }}>
              <SkeletonItem width={40} height={14} />
              <SkeletonItem width="100%" height={6} />
            </Box>
          ) : null}
        </Box>
      </Box>

      <ScrollView testID="questionnaire-template">
        <Box px="md">
          {!isLoading ? (
            <Box mb="md">
              <ScreenHeader
                title={title}
                subtitle={subtitle}
                withTopMargin={false}
              />
            </Box>
          ) : null}
          <Box>{children}</Box>
        </Box>
      </ScrollView>
      {primaryActionLabel ? (
        <Box px="sm">
          <AppButton
            label={primaryActionLabel}
            onPress={onPrimaryActionPress}
            disabled={primaryActionDisabled}
            fullWidth
          />
        </Box>
      ) : null}
    </Box>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: SPACING.md,
    position: 'relative',
    minHeight: 44,
  },
  backButtonSection: {
    position: 'absolute',
    left: SPACING.md,
    top: SPACING.md,
    zIndex: 1,
  },
  progressSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
