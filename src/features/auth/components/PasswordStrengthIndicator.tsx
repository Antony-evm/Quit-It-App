import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppText, Box } from '@/shared/components/ui';
import type { CustomPasswordValidation } from '@/shared/hooks/useCustomPasswordValidation';

interface PasswordStrengthIndicatorProps {
  validation: CustomPasswordValidation;
}

export const PasswordStrengthIndicator: React.FC<
  PasswordStrengthIndicatorProps
> = ({ validation }) => {
  const { t } = useTranslation();

  const renderRequirement = (met: boolean, text: string) => (
    <AppText variant="subcaption" tone={met ? 'success' : 'muted'}>
      {met ? '✓' : '✗'} {text}
    </AppText>
  );

  const hasPassword = !!validation.password;

  return (
    <Box py="xs" bg="backgroundMuted" borderRadius="small" gap="xs">
      <AppText variant="caption">
        {hasPassword
          ? t('auth.passwordRequirements')
          : t('auth.passwordMustContain')}
      </AppText>

      {renderRequirement(
        hasPassword &&
          validation.requirements.hasMinLength &&
          validation.requirements.hasMaxLength,
        t('auth.requirementLength'),
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasUppercase,
        t('auth.requirementUppercase'),
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasLowercase,
        t('auth.requirementLowercase'),
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasNumber,
        t('auth.requirementNumber'),
      )}
      {renderRequirement(
        hasPassword && validation.requirements.hasSymbol,
        t('auth.requirementSymbol'),
      )}
    </Box>
  );
};
