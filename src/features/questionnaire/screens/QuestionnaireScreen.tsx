import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useQuestionnaire } from '../hooks/useQuestionnaire';
import type { SelectedAnswerOption } from '../types';
import { COLOR_PALETTE, SPACING } from '../../../shared/theme';
import { AppButton, AppText } from '../../../shared/components/ui';
import { QuestionnaireQuestion } from '../components/QuestionnaireQuestion';
import { QuestionnaireReview } from '../components/QuestionnaireReview';
import { QuestionnaireTemplate } from '../components/QuestionnaireTemplate';

const DEFAULT_HEADER_TITLE = 'Questionnaire';
const REVIEW_TITLE = 'Review your answers';
const REVIEW_SUBTITLE =
  'Ensure these responses reflect your preferences before finishing.';

export const QuestionnaireScreen = () => {
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
    restart,
    goBack,
    canGoBack,
    selection,
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
  }, [question?.id, selection]);

  const headerTitle = isReviewing
    ? REVIEW_TITLE
    : prompt || DEFAULT_HEADER_TITLE;
  const headerSubtitle = isReviewing ? REVIEW_SUBTITLE : explanation;

  const primaryActionLabel = useMemo(() => {
    if (isReviewing) {
      return 'Restart questionnaire';
    }

    switch (question?.answerType) {
      case 'multiple_choice':
        return question.answerHandling === 'all'
          ? 'Save selection'
          : 'Continue';
      case 'numeric':
        return 'Submit range';
      case 'time':
        return 'Save times';
      case 'date':
        return 'Confirm date';
      default:
        return 'Continue';
    }
  }, [isReviewing, question]);

  const primaryActionDisabled =
    isLoading ||
    isSubmitting ||
    (!isReviewing && (!isSelectionValid || !activeSelection.length));

  const showValidationError =
    hasAttemptedSubmit &&
    !isReviewing &&
    (!isSelectionValid || !activeSelection.length);

  const shouldShowPrimaryAction =
    isReviewing || (!!question && !isLoading && !error);

  const handlePrimaryAction = async () => {
    if (isReviewing) {
      restart();
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
          <AppButton label="Try again" onPress={refresh} tone="secondary" />
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

  return (
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
        footerSlot={
          !isReviewing && canGoBack ? (
            <AppButton
              label="Go back"
              tone="secondary"
              disabled={isLoading || isSubmitting}
              onPress={() => {
                setHasAttemptedSubmit(false);
                goBack();
              }}
            />
          ) : undefined
        }
      >
        {renderBody()}
      </QuestionnaireTemplate>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLOR_PALETTE.backgroundMuted,
  },
  errorState: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  validation: {
    marginTop: SPACING.sm,
  },
});
