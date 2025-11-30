import { AppText, AppPressable } from '@/shared/components/ui';

type AnswerTabProps = {
  label: string;
  isSelected?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export const AnswerTab = ({
  label,
  isSelected = false,
  disabled = false,
  onPress,
}: AnswerTabProps) => {
  return (
    <AppPressable
      variant="answerGrid"
      selected={isSelected}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.9}
    >
      <AppText
        variant="body"
        tone={isSelected ? 'inverse' : 'primary'}
        style={{ textAlign: 'center' }}
      >
        {label}
      </AppText>
    </AppPressable>
  );
};
