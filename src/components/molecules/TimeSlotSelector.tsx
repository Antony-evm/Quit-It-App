import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '../atoms';
import { AnswerTabs } from './AnswerTabs';
import { SPACING } from '../../theme';

type TimeSlotSelectorProps = {
  range: string;
  selectedSlots: string[];
  onSelectionChange: (nextSelected: string[]) => void;
};

const padTime = (value: number) => value.toString().padStart(2, '0');

const generateSlotsFromRange = (range: string): string[] => {
  const [start, end] = range.split('-');

  if (!start || !end) {
    return [];
  }

  const [startHours] = start.split(':').map(Number);
  const [endHours, endMinutes = 0] = end.split(':').map(Number);

  if (
    Number.isNaN(startHours) ||
    Number.isNaN(endHours) ||
    startHours > endHours
  ) {
    return [];
  }

  const inclusiveEndHour = endMinutes > 0 ? endHours : endHours;
  const hours: number[] = [];
  for (let hour = startHours; hour <= inclusiveEndHour && hours.length < 24; hour += 1) {
    hours.push(hour);
  }

  return hours.map((hour) => `${padTime(hour)}:00`);
};

export const TimeSlotSelector = ({
  range,
  selectedSlots,
  onSelectionChange,
}: TimeSlotSelectorProps) => {
  const slots = useMemo(() => generateSlotsFromRange(range), [range]);

  return (
    <View style={styles.container}>
      <AppText tone="secondary">
        Choose one or more times that work for you.
      </AppText>
      {slots.length ? (
        <AnswerTabs
          options={slots.map((slot, index) => ({ id: index, label: slot }))}
          selectedOptionIds={selectedSlots
            .map((slot) => slots.indexOf(slot))
            .filter((index) => index >= 0)}
          selectionMode="multiple"
          onSelectionChange={(ids) => {
            const selected = ids
              .map((id) => slots[id])
              .filter((slot): slot is string => Boolean(slot));
            onSelectionChange(selected);
          }}
        />
      ) : (
        <AppText tone="secondary">No time slots available.</AppText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: SPACING.md,
  },
});
