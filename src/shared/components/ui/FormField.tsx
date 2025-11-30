import React from 'react';
import { Box } from './Box';
import { AppText } from './AppText';

export interface FormFieldProps {
  children: React.ReactNode;
  errorMessage?: string;
  successMessage?: string;
  /**
   * If true, the error message will be prefixed with '✗ '
   * @default true
   */
  showErrorIcon?: boolean;
  /**
   * If true, the success message will be prefixed with '✓ '
   * @default true
   */
  showSuccessIcon?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  errorMessage,
  successMessage,
  showErrorIcon = true,
  showSuccessIcon = true,
}) => {
  const hasError = !!errorMessage;
  const hasSuccess = !!successMessage && !hasError;

  return (
    <Box gap="xs">
      {children}
      {hasError && (
        <AppText variant="subcaption" tone="error">
          {showErrorIcon ? `✗ ${errorMessage}` : errorMessage}
        </AppText>
      )}
      {hasSuccess && (
        <AppText variant="subcaption" tone="success">
          {showSuccessIcon ? `✓ ${successMessage}` : successMessage}
        </AppText>
      )}
    </Box>
  );
};
