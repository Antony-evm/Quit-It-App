import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

import type {
  AnswerOption,
  AnswerSubOption,
  SelectedAnswerOption,
  SelectedAnswerSubOption,
  AnswerType,
} from '../types';
import { AppText, Box } from '@/shared/components/ui';
import { COLOR_PALETTE, SPACING } from '@/shared/theme';
import { TimePeriodClock } from './TimePeriodClock';

const FREQUENCY_ORDER = ['never', 'rarely', 'often', 'constantly'];

const normalizeFrequencyValue = (value: string) => value.trim().toLowerCase();

type ParsedTimeWindow = {
  startHour: number;
  endHour: number;
  periodLabel: string;
  hoursLabel: string;
};

const formatHour = (hour: number) => {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  let hour12 = normalized % 12;
  if (hour12 === 0) hour12 = 12; // Convert 0 to 12 for both midnight and noon
  return `${hour12}${suffix}`;
};

const parseHourToken = (token: string): number | null => {
  const match = token.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3].toLowerCase();
  let value = hours % 12;
  value = meridiem === 'pm' ? value + 12 : value;
  return value + minutes / 60;
};

const parseTimeWindow = (value: string): ParsedTimeWindow => {
  // Prefer the text inside parentheses; fallback to whole string
  const parenMatch = value.match(/\(([^)]+)\)/);
  const rangeText = parenMatch ? parenMatch[1] : value;
  const normalizedRange = rangeText.replace(/[\u2013\u2014]/g, '-'); // normalize en/em dash
  const [rawStart, rawEnd] = normalizedRange
    .split(/-/)
    .map(part => part.trim());

  const start = rawStart ? parseHourToken(rawStart) : null;
  const end = rawEnd ? parseHourToken(rawEnd) : null;

  const safeStart = start ?? 0;
  let safeEnd = end ?? (start !== null ? safeStart + 3 : 24);

  // If end is earlier than start, it might be a data error (like 9AM - 12AM instead of 9AM - 12PM)
  // or a legitimate overnight period. For morning periods, assume 12AM was meant to be 12PM.
  if (safeEnd <= safeStart) {
    // If this looks like a morning period that should end at noon, fix it
    if (safeStart >= 6 && safeStart <= 11 && safeEnd === 0) {
      safeEnd = 12; // Convert 12AM to 12PM for morning periods
    } else {
      // For other cases, treat as wrapping to end of day or add default duration
      safeEnd = end === 0 ? 24 : safeStart + 3;
    }
  }

  const periodLabel =
    safeStart < 12 && safeEnd <= 12
      ? 'AM'
      : safeStart >= 12 && safeEnd >= 12
      ? 'PM'
      : 'AM-PM';

  const hoursLabel = `${formatHour(safeStart)} - ${formatHour(
    Math.min(safeEnd, 24),
  )}`;
  return {
    startHour: safeStart,
    endHour: safeEnd,
    periodLabel,
    hoursLabel,
  };
};

type ClockSegmentBadgeProps = {
  startHour: number;
  endHour: number;
  label: string;
  hoursLabel: string;
};

const ClockSegmentBadge = ({
  startHour,
  endHour,
  label,
  hoursLabel,
}: ClockSegmentBadgeProps) => {
  return (
    <Box flexDirection="row" alignItems="center" gap="sm">
      <TimePeriodClock
        startHour={startHour}
        endHour={endHour}
        size={40}
        circleStroke={COLOR_PALETTE.borderDefault}
        fillOpacity={0.35}
      />
      <Box style={styles.badgeLabels}>
        <AppText variant="body" tone="primary">
          {label}
        </AppText>
        <AppText variant="body" style={styles.badgeHoursText}>
          {hoursLabel}
        </AppText>
      </Box>
    </Box>
  );
};

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

  // Parse time windows from main options (which contain time periods like "Early Morning (6AM - 9AM)")
  const enrichedMainOptions = useMemo(
    () =>
      options.map(option => ({
        ...option,
        ...parseTimeWindow(option.value),
      })),
    [options],
  );

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

    // Get the time window information from the current main option
    const enrichedMainOption = enrichedMainOptions.find(
      opt => opt.id === option.id,
    );
    const timeInfo = enrichedMainOption || parseTimeWindow(option.value);

    const edgeLabels =
      orderedSubOptions.length >= 2
        ? {
            min: orderedSubOptions[0]?.value ?? 'Never',
            max:
              orderedSubOptions[orderedSubOptions.length - 1]?.value ??
              'Always',
          }
        : null;

    const currentSub =
      selectedIndex >= 0 ? orderedSubOptions[selectedIndex] : null;

    return (
      <Box
        key={option.id}
        style={styles.gridRow}
        flexDirection="row"
        alignItems="center"
        py="sm"
        px="sm"
        gap="md"
      >
        <Box flex={1} justifyContent="center" alignItems="center">
          <Box alignItems="center" gap="xs" style={styles.clockContainer}>
            <TimePeriodClock
              startHour={timeInfo.startHour}
              endHour={timeInfo.endHour}
              size={60}
              padding={8}
            />
            <AppText variant="caption" style={styles.timeRangeText}>
              {timeInfo.hoursLabel}
            </AppText>
          </Box>
        </Box>
        <Box
          flex={3}
          justifyContent="center"
          alignItems="center"
          style={styles.sliderCell}
        >
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={Math.max(orderedSubOptions.length - 1, 0)}
            step={1}
            value={sliderValue}
            minimumTrackTintColor={COLOR_PALETTE.textPrimary}
            maximumTrackTintColor={COLOR_PALETTE.borderDefault}
            thumbTintColor={COLOR_PALETTE.textPrimary}
            onValueChange={value =>
              handleSelectionChange(option.id, Math.round(value))
            }
          />
          <Box style={styles.frequencyDisplay}>
            {currentSub ? (
              <AppText variant="caption" style={styles.currentValueText}>
                {currentSub.value}
              </AppText>
            ) : (
              <AppText
                variant="caption"
                tone="primary"
                style={styles.currentValueText}
              >
                Select a frequency
              </AppText>
            )}
          </Box>
        </Box>
      </Box>
    );
  };

  if (options.length === 0 || subOptions.length === 0) {
    return (
      <Box my="md">
        <AppText variant="body" tone="primary">
          No frequency options available
        </AppText>
      </Box>
    );
  }

  return (
    <Box my="md">
      <Box borderRadius="small" style={styles.grid}>
        {options.map((option, index) => renderGridRow(option, index))}
      </Box>
    </Box>
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
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    gap: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.borderDefault,
  },
  optionCell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clockContainer: {
    alignItems: 'center',
    gap: SPACING.xs,
    width: 100,
  },
  timeRangeText: {
    color: COLOR_PALETTE.textPrimary,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  sliderCell: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  frequencyDisplay: {
    position: 'absolute',
    top: '35%',
    width: '90%',
    alignItems: 'flex-end',
  },
  slider: {
    width: '90%',
    alignSelf: 'center',
    height: 40,
  },
  currentValueText: {
    opacity: 0.8,
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
    color: COLOR_PALETTE.textPrimary,
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  badgeLabels: {
    gap: 2,
  },
  badgeLabelText: {
    opacity: 0.9,
    fontWeight: '700',
  },
  badgeHoursText: {
    opacity: 0.8,
  },
});
