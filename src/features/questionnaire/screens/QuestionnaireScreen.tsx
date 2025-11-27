import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuestionnaire } from '../hooks/useQuestionnaire';
import { questionnaireStorage } from '../data/questionnaireStorage';
import type { SelectedAnswerOption, SelectedAnswerSubOption } from '../types';
import type { RootStackScreenProps } from '@/types/navigation';
import { BRAND_COLORS, SPACING } from '@/shared/theme';
import { AppButton, AppText, BackArrow } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '../components/QuestionnaireQuestion';
import { QuestionnaireReview } from '../components/QuestionnaireReview';
import { QuestionnaireTemplate } from '../components/QuestionnaireTemplate';
import { FrequencyGrid } from '../components/FrequencyGrid';
import { SubOptionDatePicker } from '../components/SubOptionDatePicker';
import { UserStatusService } from '@/shared/services/userStatusService';
import { useUserStatusUpdate } from '@/shared/hooks';

const DEFAULT_HEADER_TITLE = 'Questionnaire';
const REVIEW_TITLE = 'Summary';
const REVIEW_SUBTITLE =
  'Take a moment to review everything and make sure it feels right for you. You’ll be able to adjust your plan later if anything changes, this is just to help you get started.';
const QUESTIONNAIRE_SUBMIT_LABEL = 'Submit';

export const QuestionnaireScreen = ({
  navigation,
}: RootStackScreenProps<'Questionnaire'>) => {
  const { handleUserStatusUpdateWithNavigation } = useUserStatusUpdate();
  const [activeSelection, setActiveSelection] = useState<
    SelectedAnswerOption[]
  >([]);
  const [activeSubSelection, setActiveSubSelection] = useState<
    SelectedAnswerSubOption[]
  >([]);
  const [isSelectionValid, setIsSelectionValid] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const {
    isLoading,
    isSubmitting,
    isCompleting,
    error,
    refresh,
    question,
    prompt,
    explanation,
    submitAnswers,
    completeQuestionnaireFlow,
    completionData,
    isReviewing,
    history,
    goBack,
    canGoBack,
    selection,
    selectedOptions,
    selectedSubOptions,
    resumeFromReview,
    canResumeReview,
  } = useQuestionnaire();

  useEffect(() => {
    setHasAttemptedSubmit(false);
  }, [question?.id, isReviewing]);

  useEffect(() => {
    if (!question) {
      setActiveSelection([]);
      setActiveSubSelection([]);
      setIsSelectionValid(false);
      return;
    }

    // For N:N combinations, let FrequencyGrid handle main options selection
    // For numeric, time, and date questions, let QuestionnaireQuestion handle selection
    const shouldLetComponentHandleSelection =
      question.subCombination === 'N:N' ||
      question.answerType === 'numeric' ||
      question.answerType === 'time' ||
      question.answerType === 'date';

    if (!shouldLetComponentHandleSelection) {
      if (selectedOptions && selectedOptions.length) {
        setActiveSelection(selectedOptions);
        setIsSelectionValid(true);
      } else {
        setActiveSelection([]);
        setIsSelectionValid(false);
      }
    }

    if (selectedSubOptions && selectedSubOptions.length) {
      setActiveSubSelection(selectedSubOptions);
    } else {
      setActiveSubSelection([]);
    }
  }, [question, selectedOptions, selectedSubOptions]);

  const handleSelectionChange = useCallback(
    (selection: SelectedAnswerOption[]) => {
      setActiveSelection(selection);
    },
    [],
  );

  const handleValidityChange = useCallback((isValid: boolean) => {
    setIsSelectionValid(isValid);
  }, []);

  const handleSubSelectionChange = useCallback(
    (subSelection: SelectedAnswerSubOption[]) => {
      setActiveSubSelection(subSelection);
    },
    [],
  );

  const handleSubValidityChange = useCallback(
    (isSubValid: boolean) => {
      if (question?.subCombination === 'N:N') {
        setIsSelectionValid(isSubValid);
      }
    },
    [question?.subCombination],
  );

  const headerTitle = isReviewing
    ? REVIEW_TITLE
    : prompt || DEFAULT_HEADER_TITLE;
  const headerSubtitle = isReviewing ? REVIEW_SUBTITLE : explanation;

  const primaryActionLabel = useMemo(() => {
    if (isReviewing) {
      return QUESTIONNAIRE_SUBMIT_LABEL;
    }

    // Use "Submit" for most question types, "Continue" only for specific cases
    switch (question?.answerType) {
      case 'multiple_choice':
        // For multiple choice, always use "Submit" instead of varying by answerHandling
        return QUESTIONNAIRE_SUBMIT_LABEL;
      case 'numeric':
        return QUESTIONNAIRE_SUBMIT_LABEL;
      case 'time':
        return QUESTIONNAIRE_SUBMIT_LABEL;
      case 'date':
        return QUESTIONNAIRE_SUBMIT_LABEL;
      default:
        return QUESTIONNAIRE_SUBMIT_LABEL;
    }
  }, [isReviewing, question]);

  const primaryActionDisabled = isReviewing
    ? isLoading || isSubmitting || isCompleting || !history.length
    : isLoading ||
      isSubmitting ||
      isCompleting ||
      !isSelectionValid ||
      (question?.subCombination !== 'N:N' && !activeSelection.length);

  // Debug logging
  const showValidationError =
    hasAttemptedSubmit &&
    !isReviewing &&
    (!isSelectionValid ||
      (question?.subCombination !== 'N:N' && !activeSelection.length));

  const shouldShowPrimaryAction =
    isReviewing || (!!question && !isLoading && !error);

  const handlePrimaryAction = async () => {
    // Extra safeguard: don't proceed if button should be disabled
    if (primaryActionDisabled) {
      return;
    }

    if (isReviewing) {
      // Complete the questionnaire and get user status information
      try {
        const completionResponse = await completeQuestionnaireFlow();

        if (completionResponse) {
          // Update user status and handle navigation using the centralized hook
          await handleUserStatusUpdateWithNavigation(
            completionResponse,
            navigation,
          );

          // Clear questionnaire storage
          await questionnaireStorage.clear();
        } else {
          // If completion failed, fallback to home navigation
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } catch (completionError) {
        // Clear storage and navigate to home as fallback
        await questionnaireStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
      return;
    }

    setHasAttemptedSubmit(true);

    if (
      !isSelectionValid ||
      (question?.subCombination !== 'N:N' && !activeSelection.length)
    ) {
      return;
    }

    await submitAnswers(activeSelection, activeSubSelection);
  };

  const renderBody = () => {
    if (error) {
      return (
        <View style={styles.errorState}>
          <AppText variant="heading" tone="secondary">
            We could not load the questionnaire.
          </AppText>
          <AppButton label="Try again" onPress={refresh} variant="secondary" />
        </View>
      );
    }

    if (isReviewing) {
      return <QuestionnaireReview responses={history} />;
    }

    return (
      <>
        {/* For N:N combination questions, show only the frequency grid */}
        {question?.subOptions &&
        question.subOptions.length > 0 &&
        question.subCombination === 'N:N' ? (
          <FrequencyGrid
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
            initialSelection={selectedOptions}
            onSelectionChange={handleSelectionChange}
            onValidityChange={handleValidityChange}
          />
        )}

        {/* Sub-option components for other combinations */}
        {question?.subOptions &&
        question.subOptions.length > 0 &&
        question.subCombination === 'N:1' &&
        question.subAnswerType === 'date' &&
        question.subAnswerHandling === 'max' ? (
          <SubOptionDatePicker
            subOptions={question.subOptions}
            initialSelection={selectedSubOptions}
            onSelectionChange={handleSubSelectionChange}
            onValidityChange={handleSubValidityChange}
          />
        ) : question?.subOptions &&
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

        {showValidationError ? (
          <AppText tone="secondary" style={styles.validation}>
            {question?.subCombination === 'N:N'
              ? 'Please select a frequency for each time period.'
              : 'Please provide an answer before continuing.'}
          </AppText>
        ) : null}
      </>
    );
  };

  const shouldShowBackArrow =
    (!isReviewing && canGoBack) || (isReviewing && canResumeReview);

  const handleBackPress = () => {
    setHasAttemptedSubmit(false);
    if (isReviewing) {
      resumeFromReview();
    } else {
      goBack();
    }
  };

  // Calculate progress data for the progress bar
  const progressData = useMemo(() => {
    if (
      question?.orderId === undefined ||
      question?.orderId === null ||
      !question?.maxQuestion
    ) {
      return undefined;
    }

    const data = {
      currentQuestion: question.orderId + 1, // orderId is 0-based, display as 1-based
      totalQuestions: question.maxQuestion,
    };

    return data;
  }, [question?.orderId, question?.maxQuestion]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <QuestionnaireTemplate
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoading={isLoading}
          progressData={progressData}
          primaryActionLabel={
            shouldShowPrimaryAction ? primaryActionLabel : undefined
          }
          primaryActionDisabled={primaryActionDisabled}
          onPrimaryActionPress={handlePrimaryAction}
          backButton={
            shouldShowBackArrow ? (
              <BackArrow
                onPress={handleBackPress}
                disabled={isLoading || isSubmitting}
              />
            ) : undefined
          }
        >
          {renderBody()}
        </QuestionnaireTemplate>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.inkDark,
  },
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLORS.inkDark,
  },
  errorState: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  validation: {
    marginTop: SPACING.sm,
  },
});
