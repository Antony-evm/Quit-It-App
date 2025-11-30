import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuestionnaire } from '../hooks/useQuestionnaire';
import { questionnaireStorage } from '../data/questionnaireStorage';
import type { SelectedAnswerOption, SelectedAnswerSubOption } from '../types';
import type { RootStackScreenProps } from '@/types/navigation';
import { SPACING, COLOR_PALETTE } from '@/shared/theme';
import { AppButton, AppText, BackArrow, Box } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '../components/QuestionnaireQuestion';
import { QuestionnaireReview } from '../components/QuestionnaireReview';
import { QuestionnaireTemplate } from '../components/QuestionnaireTemplate';
import { FrequencyGrid } from '../components/FrequencyGrid';
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
  const [localSubmitting, setLocalSubmitting] = useState(false);

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
    orderId,
  } = useQuestionnaire();

  const [maxQuestion, setMaxQuestion] = useState<number>(0);
  const [lastQuestionId, setLastQuestionId] = useState<number | undefined>(
    undefined,
  );

  if (question?.id !== lastQuestionId) {
    setLastQuestionId(question?.id);
    setActiveSelection([]);
    setActiveSubSelection([]);
    setIsSelectionValid(false);
    setLocalSubmitting(false);
  }

  useEffect(() => {
    if (question?.maxQuestion) {
      setMaxQuestion(question.maxQuestion);
    }
  }, [question?.maxQuestion]);

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

  const primaryActionLabel = QUESTIONNAIRE_SUBMIT_LABEL;

  const primaryActionDisabled = isReviewing
    ? isLoading || isSubmitting || isCompleting || !history.length
    : isLoading ||
      isSubmitting ||
      localSubmitting ||
      isCompleting ||
      !isSelectionValid ||
      (question?.subCombination !== 'N:N' && !activeSelection.length);

  const shouldShowPrimaryAction =
    isReviewing || isLoading || (!!question && !error);

  const handlePrimaryAction = async () => {
    if (primaryActionDisabled) {
      return;
    }

    if (isReviewing) {
      try {
        setLocalSubmitting(true);
        const completionResponse = await completeQuestionnaireFlow();

        if (completionResponse) {
          await handleUserStatusUpdateWithNavigation(
            completionResponse,
            navigation,
          );
          await questionnaireStorage.clear();
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        }
      } catch (completionError) {
        await questionnaireStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
      return;
    }

    if (
      !isSelectionValid ||
      (question?.subCombination !== 'N:N' && !activeSelection.length)
    ) {
      return;
    }

    setLocalSubmitting(true);
    await submitAnswers(activeSelection, activeSubSelection);
  };

  const renderBody = () => {
    if (error) {
      return (
        <Box alignItems="center" gap="md">
          <AppText variant="heading" tone="secondary">
            We could not load the questionnaire.
          </AppText>
          <AppButton label="Try again" onPress={refresh} variant="secondary" />
        </Box>
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

  const shouldShowBackArrow =
    (!isReviewing && canGoBack) || (isReviewing && canResumeReview);

  const handleBackPress = () => {
    if (isReviewing) {
      resumeFromReview();
    } else {
      goBack();
    }
  };

  const progressData = useMemo(() => {
    const total = maxQuestion || question?.maxQuestion;

    if (orderId === undefined || orderId === null || !total) {
      return undefined;
    }

    const data = {
      currentQuestion: orderId + 1,
      totalQuestions: total,
    };

    return data;
  }, [orderId, maxQuestion, question?.maxQuestion]);

  return (
    <Box flex={1} bg="backgroundMuted">
      <SafeAreaView style={{ flex: 1 }}>
        <QuestionnaireTemplate
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoading={isLoading}
          isSubmitting={isSubmitting || isCompleting || localSubmitting}
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
    </Box>
  );
};
