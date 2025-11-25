import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';

import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  AnswerType,
} from '../types';
import { AppText } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';

type FrequencyGridProps = {
  options: AnswerOption[];
  subOptions: AnswerSubOption[];
  initialSubSelection?: SelectedAnswerSubOption[];
  onSubSelectionChange: (selection: SelectedAnswerSubOption[]) => void;
  onMainSelectionChange: (selection: SelectedAnswerOption[]) => void;
  onValidityChange?: (isValid: boolean) => void;
};

export const FrequencyGrid = ({
  options,
  subOptions,
  initialSubSelection = [],
  onSubSelectionChange,
  onMainSelectionChange,
  onValidityChange,
}: FrequencyGridProps) => {
  const [selections, setSelections] = useState<Record<number, number>>({});

  useEffect(() => {
    const initialSelections: Record<number, number> = {};

    initialSubSelection.forEach(subSelection => {});

    setSelections(initialSelections);
  }, [initialSubSelection]);

  useEffect(() => {
    if (options.length > 0) {
      const allMainOptions: SelectedAnswerOption[] = options.map(option => ({
        optionId: option.id,
        value: option.value,
        answerType: 'multiple_choice' as AnswerType,
        nextVariationId: option.nextVariationId,
      }));

      onMainSelectionChange(allMainOptions);
    }
  }, [options, onMainSelectionChange]);

  const handleSelectionChange = useCallback(
    (optionId: number, subOptionId: number) => {
      setSelections(prev => ({
        ...prev,
        [optionId]: subOptionId,
      }));
    },
    [],
  );

  useEffect(() => {
    const selectedSubOptions = Object.entries(selections)
      .map(([optionId, subOptionId]) => {
        const subOption = subOptions.find(so => so.id === subOptionId);
        if (!subOption) return null;

        return {
          optionId: subOptionId,
          value: subOption.value,
          answerType: 'multiple_choice' as AnswerType,
          combination: subOption.combination,
          mainOptionId: parseInt(optionId), // Include the main option ID for pairing
        };
      })
      .filter(item => item !== null) as SelectedAnswerSubOption[];

    onSubSelectionChange(selectedSubOptions);
    const isValid =
      options.length > 0 &&
      options.every(option => selections[option.id] !== undefined);

    onValidityChange?.(isValid);
  }, [selections, options, subOptions, onSubSelectionChange, onValidityChange]);

  const renderGridRow = (option: AnswerOption) => (
    <View key={option.id} style={styles.gridRow}>
      <View style={styles.optionCell}>
        <AppText variant="gridArea">{option.value}</AppText>
      </View>
      {subOptions.map(subOption => (
        <View key={subOption.id} style={styles.subOptionCell}>
          <TouchableOpacity
            onPress={() => handleSelectionChange(option.id, subOption.id)}
            activeOpacity={0.7}
          >
            <AppText
              variant="gridArea"
              style={[
                selections[option.id] === subOption.id &&
                  styles.subOptionTextSelected,
              ]}
            >
              {subOption.value || 'NO VALUE'}
            </AppText>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  if (options.length === 0 || subOptions.length === 0) {
    return (
      <View style={styles.container}>
        <AppText variant="body" tone="secondary">
          No frequency options available
        </AppText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map(option => renderGridRow(option))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  grid: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  optionHeaderCell: {
    flex: 2,
    justifyContent: 'center',
  },
  optionCell: {
    flex: 1.3,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xs,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
  },
  subOptionCell: {
    flex: 1,
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subOptionText: {
    textAlign: 'center',
    opacity: 0.8,
  },
  subOptionTextSelected: {
    opacity: 1,
    textDecorationLine: 'underline',
    color: COLOR_PALETTE.textPrimary,
    fontWeight: 'bold',
  },
});
