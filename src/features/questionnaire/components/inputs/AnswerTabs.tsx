import { useCallback } from 'react';

import {
  AnswerTab,
  ANSWER_TAB_VARIANTS,
  AnswerTabVariantType,
} from './AnswerTab';
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
  variant?: AnswerTabVariantType;
  onSelectionChange: (nextSelected: number[]) => void;
};

export const AnswerTabs = ({
  options,
  selectedOptionIds,
  selectionMode = 'single',
  variant = ANSWER_TAB_VARIANTS.DEFAULT,
  onSelectionChange,
}: AnswerTabsProps) => {
  const isMulti = selectionMode === 'multiple';
  const safeVariant = variant || ANSWER_TAB_VARIANTS.DEFAULT;

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
    <Box flexDirection="row" flexWrap="wrap" gap="md">
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
    </Box>
  );
};
