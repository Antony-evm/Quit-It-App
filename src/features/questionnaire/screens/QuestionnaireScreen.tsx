import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuestionnaire } from '../hooks/useQuestionnaire';
import { questionnaireStorage } from '../data/questionnaireStorage';
import type { SelectedAnswerOption } from '../types';
import type { RootStackScreenProps } from '@/types/navigation';
import { BRAND_COLORS, SPACING } from '@/shared/theme';
import { AppButton, AppText, BackArrow } from '@/shared/components/ui';
import { QuestionnaireQuestion } from '../components/QuestionnaireQuestion';
import { QuestionnaireReview } from '../components/QuestionnaireReview';
import { QuestionnaireTemplate } from '../components/QuestionnaireTemplate';

const DEFAULT_HEADER_TITLE = 'Questionnaire';
const REVIEW_TITLE = 'Summary';
const REVIEW_SUBTITLE =
  'Take a moment to review everything and make sure it feels right for you. You’ll be able to adjust your plan later if anything changes, this is just to help you get started.';
const QUESTIONNAIRE_SUBMIT_LABEL = 'Submit';

export const QuestionnaireScreen = ({
  navigation,
}: RootStackScreenProps<'Questionnaire'>) => {
  const [activeSelection, setActiveSelection] = useState<
    SelectedAnswerOption[]
  >([]);
  const [isSelectionValid, setIsSelectionValid] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const {
    isLoading,
    isSubmitting,
    error,
    refresh,
    question,
    prompt,
    explanation,
    submitAnswers,
    isReviewing,
    history,
    goBack,
    canGoBack,
    selection,
    resumeFromReview,
    canResumeReview,
  } = useQuestionnaire();

  useEffect(() => {
    setHasAttemptedSubmit(false);
  }, [question?.id, isReviewing]);

  useEffect(() => {
    if (!question) {
      setActiveSelection([]);
      setIsSelectionValid(false);
      return;
    }

    if (selection && selection.length) {
      setActiveSelection(selection);
      setIsSelectionValid(true);
    } else {
      setActiveSelection([]);
      setIsSelectionValid(false);
    }
  }, [question, selection]);

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
    ? isLoading || isSubmitting || !history.length
    : isLoading || isSubmitting || !isSelectionValid || !activeSelection.length;

  const showValidationError =
    hasAttemptedSubmit &&
    !isReviewing &&
    (!isSelectionValid || !activeSelection.length);

  const shouldShowPrimaryAction =
    isReviewing || (!!question && !isLoading && !error);

  const handlePrimaryAction = async () => {
    // Extra safeguard: don't proceed if button should be disabled
    if (primaryActionDisabled) {
      return;
    }

    if (isReviewing) {
      // Individual answers were already submitted, just clear storage and navigate
      try {
        await questionnaireStorage.clear();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch {
        // Handle navigation errors if needed
      }
      return;
    }

    setHasAttemptedSubmit(true);

    if (!isSelectionValid || !activeSelection.length) {
      return;
    }

    await submitAnswers(activeSelection);
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
        <QuestionnaireQuestion
          question={question}
          initialSelection={selection}
          onSelectionChange={setActiveSelection}
          onValidityChange={setIsSelectionValid}
        />
        {showValidationError ? (
          <AppText tone="secondary" style={styles.validation}>
            Please provide an answer before continuing.
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

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <QuestionnaireTemplate
          title={headerTitle}
          subtitle={headerSubtitle}
          isLoading={isLoading}
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
