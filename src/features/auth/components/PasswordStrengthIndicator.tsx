import React from 'react';
import { AppText, Box } from '@/shared/components/ui';
import type { CustomPasswordValidation } from '@/shared/hooks/useCustomPasswordValidation';

interface PasswordStrengthIndicatorProps {
  validation: CustomPasswordValidation;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ validation }) => {
  const renderRequirement = (met: boolean, text: string) => (
    <AppText variant="subcaption" tone={met ? 'success' : 'muted'}>
      {met ? '✓' : '✗'} {text}
    </AppText>
  );

  const hasPassword = !!validation.password;

  return (
    <Box py="xs" bg="backgroundMuted" borderRadius="small" gap="xs">
      <AppText variant="caption">
        {hasPassword ? 'Password Requirements:' : 'Password must contain:'}
      </AppText>

      {renderRequirement(
        hasPassword &&
          validation.requirements.hasMinLength &&
          validation.requirements.hasMaxLength,
        '8-32 characters',
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasUppercase,
        'At least one uppercase letter',
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasLowercase,
        'At least one lowercase letter',
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasNumber,
        'At least one number',
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasSymbol,
        'At least one special character',
      )}
    </Box>
  );
};
