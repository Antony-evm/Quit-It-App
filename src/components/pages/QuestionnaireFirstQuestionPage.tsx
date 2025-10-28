import React, { useMemo } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import { useQuestionnaire } from '../../hooks/useQuestionnaire';
import { QuestionnaireTemplate } from '../templates';
import { QuestionnaireQuestion } from '../organisms';
import { AppButton, AppText } from '../atoms';
import { COLOR_PALETTE, SPACING } from '../../theme';

const PLACEHOLDER_PRIMARY_ACTION_LABEL = 'Continue Placeholder';

export const QuestionnaireFirstQuestionPage = () => {
  const { isLoading, error, refresh, title, subtitle, questions } =
    useQuestionnaire();

  const firstQuestion = useMemo(
    () => (questions.length > 0 ? questions[0] : null),
    [questions],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <QuestionnaireTemplate
        title={title}
        subtitle={subtitle}
        isLoading={isLoading}
        primaryActionLabel={PLACEHOLDER_PRIMARY_ACTION_LABEL}
        onPrimaryActionPress={() => {
          // Hook up navigation to the next screen when defined.
        }}>
        {error ? (
          <View style={styles.errorState}>
            <AppText variant="heading" tone="secondary">
              There was a problem loading the first question placeholder.
            </AppText>
            <AppButton
              label="Tap to retry placeholder"
              onPress={refresh}
              tone="secondary"
            />
          </View>
        ) : (
          <QuestionnaireQuestion question={firstQuestion} />
        )}
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
});
