import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Svg, { Circle, Path } from 'react-native-svg';

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

type ParsedTimeWindow = {
  startHour: number;
  endHour: number;
  periodLabel: string;
  hoursLabel: string;
};

const formatHour = (hour: number) => {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  const hour12 = normalized % 12 === 0 ? 12 : normalized % 12;
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
  const normalizedRange = rangeText.replace(/[\u2013\u2014]/g, ' - '); // normalize en/em dash
  const [rawStart, rawEnd] = normalizedRange
    .split(/ - /)
    .map(part => part.trim());

  const start = rawStart ? parseHourToken(rawStart) : null;
  const end = rawEnd ? parseHourToken(rawEnd) : null;

  const safeStart = start ?? 0;
  let safeEnd = end ?? (start !== null ? safeStart + 3 : 24);

  // If end is earlier than start, treat it as wrapping forward (e.g., 9AM - 12AM => end of day)
  if (safeEnd <= safeStart) {
    safeEnd = end === 0 ? 24 : safeStart + 3;
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

const polarPoint = (center: number, radius: number, hour: number) => {
  const angle = ((hour / 24) * 360 - 90) * (Math.PI / 180);
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  };
};

const buildArcPath = (size: number, startHour: number, endHour: number) => {
  const radius = size / 2 - 4;
  const center = size / 2;
  const clampedStart = Math.max(0, Math.min(startHour, 24));
  const clampedEnd = Math.max(0, Math.min(endHour, 24));
  const arcEnd = clampedEnd <= clampedStart ? clampedStart + 0.1 : clampedEnd;
  const start = polarPoint(center, radius, clampedStart);
  const end = polarPoint(center, radius, arcEnd);
  const arcSpan = arcEnd - clampedStart;
  const largeArcFlag = arcSpan > 12 ? 1 : 0;
  return {
    d: [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      'Z',
    ].join(' '),
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
  const size = 60;
  const { d } = buildArcPath(size, startHour, endHour);

  return (
    <View style={styles.badgeContainer}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 4}
          fill={BRAND_COLORS.inkDark}
          stroke={COLOR_PALETTE.borderDefault}
          strokeWidth={2}
        />
        <Path
          d={d}
          fill={COLOR_PALETTE.accentPrimary}
          fillOpacity={0.35}
          stroke={COLOR_PALETTE.accentPrimary}
          strokeWidth={2}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.badgeLabels}>
        <AppText variant="caption" style={styles.badgeLabelText}>
          {label}
        </AppText>
        <AppText variant="caption" style={styles.badgeHoursText}>
          {hoursLabel}
        </AppText>
      </View>
    </View>
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

  const enrichedSubOptions = useMemo(
    () =>
      orderedSubOptions.map(sub => ({
        ...sub,
        ...parseTimeWindow(sub.value),
      })),
    [orderedSubOptions],
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
      const subOption = enrichedSubOptions[sliderIndex];
      if (!subOption) {
        return;
      }

      setSelections(prev => ({
        ...prev,
        [optionId]: subOption.id,
      }));
    },
    [enrichedSubOptions],
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
    const selectedIndex = enrichedSubOptions.findIndex(
      sub => sub.id === selections[option.id],
    );
    const sliderValue = selectedIndex >= 0 ? selectedIndex : 0;
    const edgeLabels =
      enrichedSubOptions.length >= 2
        ? {
            min: enrichedSubOptions[0]?.periodLabel ?? 'AM',
            max:
              enrichedSubOptions[enrichedSubOptions.length - 1]?.periodLabel ??
              'PM',
          }
        : null;

    const currentSub =
      selectedIndex >= 0 ? enrichedSubOptions[selectedIndex] : null;

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
            maximumValue={Math.max(enrichedSubOptions.length - 1, 0)}
            step={1}
            value={sliderValue}
            minimumTrackTintColor={BRAND_COLORS.cream}
            maximumTrackTintColor={COLOR_PALETTE.borderDefault}
            thumbTintColor={BRAND_COLORS.cream}
            onValueChange={value =>
              handleSelectionChange(option.id, Math.round(value))
            }
          />
          {currentSub ? (
            <View style={styles.currentValue}>
              <ClockSegmentBadge
                startHour={currentSub.startHour}
                endHour={currentSub.endHour}
                label={currentSub.periodLabel}
                hoursLabel={currentSub.hoursLabel}
              />
            </View>
          ) : (
            <AppText
              variant="caption"
              tone="primary"
              style={styles.currentValueText}
            >
              Select a time window
            </AppText>
          )}
        </View>
      </View>
    );
  };

  if (options.length === 0 || subOptions.length === 0) {
    return (
      <View style={styles.container}>
        <AppText variant="body" tone="primary">
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
  currentValue: {
    alignItems: 'flex-end',
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
    color: BRAND_COLORS.cream,
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
