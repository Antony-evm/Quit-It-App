import { useCallback } from 'react';

import { AnswerTab } from './AnswerTab';
import { Box } from '@/shared/components/ui';

type AnswerTabOption = {
  id: number;
  label: string;
  disabled?: boolean;
};

type AnswerTabsProps = {
  options: AnswerTabOption[];
  selectedOptionIds: number[];
  selectionMode?: 'single' | 'multiple';
  onSelectionChange: (nextSelected: number[]) => void;
};

export const AnswerTabs = ({
  options,
  selectedOptionIds,
  selectionMode = 'single',
  onSelectionChange,
}: AnswerTabsProps) => {
  const isMulti = selectionMode === 'multiple';

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

  return (
    <Box flexDirection="row" flexWrap="wrap" gap="lg">
      {options.map(option => (
        <AnswerTab
          key={option.id}
          label={option.label}
          disabled={option.disabled}
          isSelected={selectedOptionIds.includes(option.id)}
          onPress={() => handleToggle(option.id)}
        />
      ))}
    </Box>
  );
};
