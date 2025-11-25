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
  // Store selections as Record<optionId, subOptionId>
  const [selections, setSelections] = useState<Record<number, number>>({});

  // Initialize selections from initial data
  useEffect(() => {
    const initialSelections: Record<number, number> = {};

    // Group initial selections by option (assuming the combination logic connects them)
    initialSubSelection.forEach(subSelection => {
      // For N:N combination, we need to determine which option this sub-selection belongs to
      // This might need to be adjusted based on your backend logic
      // For now, assuming we can derive it from the order or some other logic
    });

    setSelections(initialSelections);
  }, [initialSubSelection]);

  // Auto-select all main options for frequency grid (N:N combination)
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

  // Handle selection change for a specific option-subOption pair
  const handleSelectionChange = useCallback(
    (optionId: number, subOptionId: number) => {
      setSelections(prev => ({
        ...prev,
        [optionId]: subOptionId,
      }));
    },
    [],
  );

  // Convert internal selections to the format expected by parent
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

    // Check if all options have a selection (validation)
    const isValid =
      options.length > 0 &&
      options.every(option => selections[option.id] !== undefined);

    console.log('[FrequencyGrid] Validation check:', {
      optionsCount: options.length,
      selectionsCount: Object.keys(selections).length,
      selections,
      isValid,
    });

    onValidityChange?.(isValid);
  }, [selections, options, subOptions, onSubSelectionChange, onValidityChange]);

  const renderGridHeader = () => (
    <View style={styles.gridHeader}>
      <View style={styles.optionHeaderCell}>
        <AppText variant="body">Activity</AppText>
      </View>
      {subOptions.map(subOption => (
        <View key={subOption.id} style={styles.subOptionHeaderCell}>
          <AppText variant="caption" style={styles.headerText}>
            {subOption.value}
          </AppText>
        </View>
      ))}
    </View>
  );

  const renderGridRow = (option: AnswerOption) => (
    <View key={option.id} style={styles.gridRow}>
      <View style={styles.optionCell}>
        <AppText variant="body">{option.value}</AppText>
      </View>
      {subOptions.map(subOption => (
        <View key={subOption.id} style={styles.subOptionCell}>
          <TouchableOpacity
            style={[
              styles.radioButton,
              selections[option.id] === subOption.id &&
                styles.radioButtonSelected,
            ]}
            onPress={() => handleSelectionChange(option.id, subOption.id)}
            activeOpacity={0.7}
          >
            {selections[option.id] === subOption.id && (
              <View style={styles.radioButtonInner} />
            )}
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
      <AppText variant="body" style={styles.instructions}>
        Select how often you smoke during each time period:
      </AppText>
      <View style={styles.grid}>
        {renderGridHeader()}
        {options.map(option => renderGridRow(option))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  instructions: {
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  grid: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.borderDefault,
    borderRadius: 8,
    overflow: 'hidden',
  },
  gridHeader: {
    flexDirection: 'row',
    backgroundColor: COLOR_PALETTE.backgroundMuted,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  gridRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  optionHeaderCell: {
    flex: 2,
    padding: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
    justifyContent: 'center',
  },
  subOptionHeaderCell: {
    flex: 1,
    padding: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCell: {
    flex: 2,
    padding: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
    justifyContent: 'center',
  },
  subOptionCell: {
    flex: 1,
    padding: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLOR_PALETTE.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLOR_PALETTE.borderDefault,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_PALETTE.backgroundCream,
  },
  radioButtonSelected: {
    borderColor: COLOR_PALETTE.accentPrimary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLOR_PALETTE.accentPrimary,
  },
});
