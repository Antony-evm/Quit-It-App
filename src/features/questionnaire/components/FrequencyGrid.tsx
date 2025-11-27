import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';

import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  AnswerType,
} from '../types';
import { AppText } from '@/shared/components/ui';
import { BRAND_COLORS, COLOR_PALETTE, SPACING } from '@/shared/theme';

const FREQUENCY_ORDER = ['never', 'rarely', 'often', 'constantly'];

const normalizeFrequencyValue = (value: string) => value.trim().toLowerCase();

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

  const orderedSubOptions = useMemo(() => {
    const withPriority = subOptions.map((subOption, index) => {
      const priority = FREQUENCY_ORDER.indexOf(
        normalizeFrequencyValue(subOption.value),
      );

      return {
        subOption,
        priority: priority === -1 ? FREQUENCY_ORDER.length + index : priority,
      };
    });

    return withPriority
      .sort((a, b) => a.priority - b.priority)
      .map(item => item.subOption);
  }, [subOptions]);

  useEffect(() => {
    const initialSelections: Record<number, number> = {};

    initialSubSelection.forEach(subSelection => {
      if (subSelection.mainOptionId !== undefined) {
        initialSelections[subSelection.mainOptionId] = subSelection.optionId;
      }
    });

    setSelections(initialSelections);
  }, [initialSubSelection]);

  // Ensure every row has a default selection (defaults to the first sub-option, e.g. "Never")
  useEffect(() => {
    if (!orderedSubOptions.length || !options.length) {
      return;
    }

    setSelections(prev => {
      let changed = false;
      const next = { ...prev };

      options.forEach(option => {
        if (next[option.id] === undefined) {
          next[option.id] = orderedSubOptions[0].id;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [options, orderedSubOptions]);

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
    (optionId: number, sliderIndex: number) => {
      const subOption = orderedSubOptions[sliderIndex];
      if (!subOption) {
        return;
      }

      setSelections(prev => ({
        ...prev,
        [optionId]: subOption.id,
      }));
    },
    [orderedSubOptions],
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

  const renderGridRow = (option: AnswerOption, index: number) => {
    const selectedIndex = orderedSubOptions.findIndex(
      sub => sub.id === selections[option.id],
    );
    const sliderValue = selectedIndex >= 0 ? selectedIndex : 0;
    const edgeLabels =
      orderedSubOptions.length >= 2
        ? {
            min: orderedSubOptions[0]?.value ?? 'Never',
            max:
              orderedSubOptions[orderedSubOptions.length - 1]?.value ??
              'Constantly',
          }
        : null;

    const currentLabel =
      selectedIndex >= 0 && orderedSubOptions[selectedIndex]
        ? orderedSubOptions[selectedIndex].value
        : 'Select a frequency';

    return (
      <View key={option.id} style={styles.gridRow}>
        <View style={styles.optionCell}>
          <AppText variant="gridArea">{option.value}</AppText>
        </View>
        <View style={styles.sliderCell}>
          {index === 0 && edgeLabels ? (
            <View style={styles.edgeLabels}>
              <AppText variant="caption" style={styles.edgeLabel}>
                {edgeLabels.min}
              </AppText>
              <AppText variant="caption" style={styles.edgeLabel}>
                {edgeLabels.max}
              </AppText>
            </View>
          ) : (
            <View style={styles.edgeLabelsPlaceholder} />
          )}
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(orderedSubOptions.length - 1, 0)}
            step={1}
            value={sliderValue}
            minimumTrackTintColor={BRAND_COLORS.cream}
            maximumTrackTintColor={COLOR_PALETTE.borderDefault}
            thumbTintColor={BRAND_COLORS.cream}
            onValueChange={value =>
              handleSelectionChange(option.id, Math.round(value))
            }
          />
          <AppText variant="caption" style={styles.currentValue}>
            {currentLabel}
          </AppText>
        </View>
      </View>
    );
  };

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
        {options.map((option, index) => renderGridRow(option, index))}
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
    alignItems: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  optionCell: {
    flex: 1,
    paddingRight: SPACING.md,
    justifyContent: 'center',
  },
  sliderCell: {
    flex: 3,
    gap: SPACING.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  edgeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
  },
  edgeLabelsPlaceholder: {
    height: 16,
  },
  edgeLabel: {
    color: BRAND_COLORS.cream,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  currentValue: {
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
});
