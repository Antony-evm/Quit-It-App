import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import { AnswerTab } from './AnswerTab';
import { SPACING } from '@/shared/theme';

type AnswerTabOption = {
  id: number;
  label: string;
  disabled?: boolean;
};

type AnswerTabVariant =
  | 'timeslot'
  | 'multiple-many'
  | 'multiple-few'
  | 'default';

type AnswerTabsProps = {
  options: AnswerTabOption[];
  selectedOptionIds: number[];
  selectionMode?: 'single' | 'multiple';
  variant?: AnswerTabVariant;
  onSelectionChange: (nextSelected: number[]) => void;
};

export const AnswerTabs = ({
  options,
  selectedOptionIds,
  selectionMode = 'single',
  variant = 'default',
  onSelectionChange,
}: AnswerTabsProps) => {
  const isMulti = selectionMode === 'multiple';

  // Handle null/undefined variant
  const safeVariant = variant || 'default';

  const handleToggle = useCallback(
    (optionId: number) => {
      const alreadySelected = selectedOptionIds.includes(optionId);

      if (isMulti) {
        const nextSelected = alreadySelected
          ? selectedOptionIds.filter(id => id !== optionId)
          : [...selectedOptionIds, optionId];
        onSelectionChange(nextSelected);
        return;
      }

      if (alreadySelected) {
        onSelectionChange([]);
        return;
      }

      onSelectionChange([optionId]);
    },
    [isMulti, onSelectionChange, selectedOptionIds],
  );

  const containerStyle =
    safeVariant === 'multiple-few' ? styles.stackedContainer : styles.container;

  return (
    <View style={containerStyle}>
      {options.map(option => (
        <AnswerTab
          key={option.id}
          label={option.label}
          disabled={option.disabled}
          isSelected={selectedOptionIds.includes(option.id)}
          variant={safeVariant}
          onPress={() => handleToggle(option.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  stackedContainer: {
    width: '100%',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    gap: SPACING.sm,
  },
});
