import {
  formatDisplayDate,
  formatPlanDate,
  getRelativeDateInfo,
} from '@/utils/dateUtils';

const DATE_SUBMISSION_SEPARATOR = ' ';

export const formatDateForSubmission = (date: Date) => {
  const utc = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  const iso = utc.toISOString().split('.')[0];
  return `${iso.replace('T', DATE_SUBMISSION_SEPARATOR)}+00:00`;
};

export const parseSubmissionDateValue = (value: string) => {
  if (!value) {
    return null;
  }

  const normalized = value.replace(DATE_SUBMISSION_SEPARATOR, 'T');
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

// Re-export shared date utils for backward compatibility
export { formatDisplayDate, formatPlanDate, getRelativeDateInfo };
