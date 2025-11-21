import { useState, useEffect, useMemo } from 'react';
import zxcvbn from 'zxcvbn';

export interface PasswordValidation {
  password: string;
  isValid: boolean;
  score: number;
  feedback: {
    warning?: string;
    suggestions: string[];
  };
  crackTime: string;
}

export const usePasswordValidation = (password: string): PasswordValidation => {
  const [validation, setValidation] = useState<PasswordValidation>({
    password: '',
    isValid: false,
    score: 0,
    feedback: { suggestions: [] },
    crackTime: '',
  });

  const analysis = useMemo(() => {
    if (!password) {
      return null;
    }
    return zxcvbn(password);
  }, [password]);

  useEffect(() => {
    if (!analysis) {
      setValidation({
        password: '',
        isValid: false,
        score: 0,
        feedback: { suggestions: [] },
        crackTime: '',
      });
      return;
    }

    setValidation({
      password,
      isValid: analysis.score >= 3, // Strict requirement: score must be 3 or higher
      score: analysis.score,
      feedback: {
        warning: analysis.feedback.warning,
        suggestions: analysis.feedback.suggestions,
      },
      crackTime: String(
        analysis.crack_times_display.offline_slow_hashing_1e4_per_second,
      ),
    });
  }, [password, analysis]);

  return validation;
};

// Helper function to validate password strength
export const validatePasswordStrength = (password: string): boolean => {
  if (!password) return false;
  const result = zxcvbn(password);
  return result.score >= 3;
};

// Helper function to get password strength details
export const getPasswordStrengthDetails = (password: string) => {
  if (!password) return null;
  return zxcvbn(password);
};
