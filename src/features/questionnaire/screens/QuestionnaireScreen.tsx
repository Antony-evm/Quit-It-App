import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackScreenProps } from '@/types/navigation';
import { SPACING } from '@/shared/theme';
import { AppButton, AppText, BackArrow, Box } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '../components/QuestionnaireQuestion';
import { QuestionnaireReview } from '../components/QuestionnaireReview';
import { QuestionnaireTemplate } from '../components/QuestionnaireTemplate';
import { QuestionnaireSkeleton } from '../components/QuestionnaireSkeleton';
import { FrequencyGrid } from '../components/FrequencyGrid';
import { useQuestionnaireScreen } from '../hooks/useQuestionnaireScreen';

export const QuestionnaireScreen = ({
  navigation,
}: RootStackScreenProps<'Questionnaire'>) => {
  const {
    // State
    question,
    isLoading,
    isSubmitting,
    error,
    isReviewing,
    reviewData,

    // Derived values
    headerTitle,
    headerSubtitle,
    primaryActionLabel,
    primaryActionDisabled,
    shouldShowBackArrow,
    progressData,

    // For FrequencyGrid
    selectedSubOptions,
    refreshKey,

    // Handlers
    handleSelectionChange,
    handleValidityChange,
    handleSubSelectionChange,
    handleSubValidityChange,
    handlePrimaryAction,
    handleBackPress,
    refresh,
  } = useQuestionnaireScreen({ navigation });

  const renderBody = () => {
    if (error) {
      return (
        <Box alignItems="center" gap="md">
          <AppText variant="heading" tone="error">
            We could not load the questionnaire.
          </AppText>
          <AppButton fullWidth label="Try again" onPress={refresh} />
        </Box>
      );
    }

    if (isReviewing) {
      return <QuestionnaireReview reviewData={reviewData} />;
    }

    return (
      <>
        {/* For N:N combination questions, show only the frequency grid */}
        {question?.subOptions &&
        question.subOptions.length > 0 &&
        question.subCombination === 'N:N' ? (
          <FrequencyGrid
            key={`${question.id}-${refreshKey}`}
            options={question.options}
            subOptions={question.subOptions}
            initialSubSelection={selectedSubOptions}
            onSubSelectionChange={handleSubSelectionChange}
            onMainSelectionChange={handleSelectionChange}
            onValidityChange={handleSubValidityChange}
          />
        ) : (
          /* For regular questions, show the standard question component */
          <QuestionnaireQuestion
            question={question}
            onSelectionChange={handleSelectionChange}
            onValidityChange={handleValidityChange}
          />
        )}

        {/* Sub-option components for other combinations */}
        {question?.subOptions &&
        question.subOptions.length > 0 &&
        question.subCombination !== 'N:N' ? (
          <AppText
            variant="body"
            tone="primary"
            style={{ marginTop: SPACING.lg }}
          >
            Sub-options with combination "{question.subCombination}" - UI not
            implemented yet
          </AppText>
        ) : null}
      </>
    );
  };

  return (
    <Box flex={1} bg="muted">
      <SafeAreaView style={{ flex: 1 }}>
        <QuestionnaireTemplate
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoading={isLoading}
          isSubmitting={isSubmitting}
          progressData={progressData}
          primaryActionLabel={primaryActionLabel}
          primaryActionDisabled={primaryActionDisabled}
          onPrimaryActionPress={handlePrimaryAction}
          backButton={
            shouldShowBackArrow ? (
              <BackArrow onPress={handleBackPress} disabled={isLoading} />
            ) : undefined
          }
        >
          {isLoading ? <QuestionnaireSkeleton /> : renderBody()}
        </QuestionnaireTemplate>
      </SafeAreaView>
    </Box>
  );
};
