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

export const formatDisplayDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getRelativeDateInfo = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 1) return `In ${diffDays} days`;
  if (diffDays < -1) return `${Math.abs(diffDays)} days ago`;

  return '';
};
