import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { QuestionnaireQuestion as QuestionnaireQuestionType } from '../../types/questionnaire';
import { AppText } from '../atoms';
import { QuestionHeader, QuestionOptionCard } from '../molecules';
import { SPACING } from '../../theme';

type QuestionnaireQuestionProps = {
  question: QuestionnaireQuestionType | null;
  onSelectOption?: (optionId: string) => void;
};

const PLACEHOLDER_QUESTION: QuestionnaireQuestionType = {
  id: 'placeholder-question-id',
  prompt: 'Placeholder question prompt',
  description: 'This text is replaced when the API responds.',
  type: 'single',
  options: [
    {
      id: 'placeholder-option-a',
      label: 'Placeholder option A',
      value: 'placeholder-a',
    },
    {
      id: 'placeholder-option-b',
      label: 'Placeholder option B',
      value: 'placeholder-b',
    },
  ],
};

export const QuestionnaireQuestion = ({
  question,
  onSelectOption,
}: QuestionnaireQuestionProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const resolvedQuestion = useMemo(
    () => question ?? PLACEHOLDER_QUESTION,
    [question],
  );

  const handleSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
    onSelectOption?.(optionId);
  };

  return (
    <View style={styles.container}>
      <QuestionHeader
        title={resolvedQuestion.prompt}
        subtitle={resolvedQuestion.description}
      />
      <View style={styles.options}>
        {resolvedQuestion.options?.length ? (
          resolvedQuestion.options.map((option) => (
            <QuestionOptionCard
              key={option.id}
              label={option.label}
              description={option.value}
              isSelected={selectedOptionId === option.id}
              onPress={() => handleSelect(option.id)}
            />
          ))
        ) : (
          <AppText tone="secondary">
            No options available for this question yet.
          </AppText>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.lg,
  },
  options: {
    gap: SPACING.md,
  },
});
