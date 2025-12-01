import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useQuestionnaire } from './useQuestionnaire';
import { questionnaireStorage } from '../services/questionnaireStorage';
import type { SelectedAnswerOption, SelectedAnswerSubOption } from '../types';
import { useUserStatusUpdate } from '@/shared/hooks';
import type { RootStackParamList } from '@/types/navigation';

const DEFAULT_HEADER_TITLE = 'Questionnaire';
const REVIEW_TITLE = 'Summary';
const REVIEW_SUBTITLE =
  "Take a moment to review everything and make sure it feels right for you. You'll be able to adjust your plan later if anything changes, this is just to help you get started.";
const QUESTIONNAIRE_SUBMIT_LABEL = 'Submit';

type UseQuestionnaireScreenOptions = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Questionnaire'>;
};

export const useQuestionnaireScreen = ({
  navigation,
}: UseQuestionnaireScreenOptions) => {
  const { handleUserStatusUpdateWithNavigation } = useUserStatusUpdate();
  const [activeSelection, setActiveSelection] = useState<
    SelectedAnswerOption[]
  >([]);
  const [activeSubSelection, setActiveSubSelection] = useState<
    SelectedAnswerSubOption[]
  >([]);
  const [isSelectionValid, setIsSelectionValid] = useState(false);
  const [localSubmitting, setLocalSubmitting] = useState(false);

  const questionnaire = useQuestionnaire();

  const {
    isLoading,
    isSubmitting,
    isCompleting,
    error,
    question,
    prompt,
    explanation,
    submitAnswers,
    completeQuestionnaireFlow,
    isReviewing,
    history,
    goBack,
    canGoBack,
    selectedOptions,
    selectedSubOptions,
    resumeFromReview,
    canResumeReview,
    orderId,
  } = questionnaire;

  const maxQuestionRef = useRef<number>(0);
  const previousQuestionIdRef = useRef<number | undefined>(undefined);

  // Update maxQuestion ref when we get a value
  if (question?.maxQuestion && question.maxQuestion > maxQuestionRef.current) {
    maxQuestionRef.current = question.maxQuestion;
  }

  // Reset state when question changes
  useEffect(() => {
    if (question?.id !== previousQuestionIdRef.current) {
      previousQuestionIdRef.current = question?.id;
      setActiveSelection([]);
      setActiveSubSelection([]);
      setIsSelectionValid(false);
      setLocalSubmitting(false);
    }
  }, [question?.id]);

  useEffect(() => {
    if (!question) {
      setActiveSelection([]);
      setActiveSubSelection([]);
      setIsSelectionValid(false);
      return;
    }

    const shouldLetComponentHandleSelection =
      question.subCombination === 'N:N' ||
      question.answerType === 'numeric' ||
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

  const handlePrimaryAction = useCallback(async () => {
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
  }, [
    primaryActionDisabled,
    isReviewing,
    isSelectionValid,
    question?.subCombination,
    activeSelection,
    activeSubSelection,
    completeQuestionnaireFlow,
    handleUserStatusUpdateWithNavigation,
    navigation,
    submitAnswers,
  ]);

  const shouldShowBackArrow =
    (!isReviewing && canGoBack) || (isReviewing && canResumeReview);

  const handleBackPress = useCallback(() => {
    if (isReviewing) {
      resumeFromReview();
    } else {
      goBack();
    }
  }, [isReviewing, resumeFromReview, goBack]);

  const progressData = useMemo(() => {
    const total = maxQuestionRef.current || question?.maxQuestion;

    if (orderId === undefined || orderId === null || !total) {
      return undefined;
    }

    return {
      currentQuestion: orderId + 1,
      totalQuestions: total,
    };
  }, [orderId, question?.maxQuestion]);

  return {
    // State
    question,
    isLoading,
    isSubmitting: isSubmitting || isCompleting || localSubmitting,
    error,
    isReviewing,
    history,
    activeSelection,
    activeSubSelection,

    // Derived values
    headerTitle,
    headerSubtitle,
    primaryActionLabel: shouldShowPrimaryAction
      ? primaryActionLabel
      : undefined,
    primaryActionDisabled,
    shouldShowBackArrow,
    progressData,

    // For FrequencyGrid
    selectedSubOptions,

    // Handlers
    handleSelectionChange,
    handleValidityChange,
    handleSubSelectionChange,
    handleSubValidityChange,
    handlePrimaryAction,
    handleBackPress,

    // From questionnaire hook
    refresh: questionnaire.refresh,
  };
};
