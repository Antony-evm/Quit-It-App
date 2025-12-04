export type FormattedDateLabels = {
  dateLabel: string;
  timeLabel: string;
};

/**
 * Formats a Date to YYYY-MM-DD string in local timezone
 * Use this for consistent date string formatting throughout the app
 */
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Formats a date for display (e.g., "Monday, November 30, 2025")
 */
export const formatDisplayDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats a date for plan display (e.g., "November 30, 2025")
 */
export const formatPlanDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Returns a relative description of a date (Today, Tomorrow, Yesterday, In X days, X days ago)
 */
export const getRelativeDateInfo = (date: Date): string => {
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

/**
 * Formats a date into relative date label (Today, Yesterday, or formatted date)
 * and a time label.
 *
 * @param dateString ISO datetime string or Date object
 * @returns Object with dateLabel and timeLabel
 */
export const formatRelativeDate = (
  dateString: string | Date,
): FormattedDateLabels => {
  const date =
    typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const recordDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = today.getTime() - recordDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  let dateLabel: string;
  if (diffDays === 0) {
    dateLabel = 'Today';
  } else if (diffDays === 1) {
    dateLabel = 'Yesterday';
  } else {
    dateLabel = date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }

  const timeLabel = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });

  return { dateLabel, timeLabel };
};

/**
 * Calculates the difference between two dates and returns a formatted string.
 * Format: "Xd Xhrs Xmins Xs"
 * Rules:
 * - Leading zero units are omitted.
 * - If the difference is more than 1 week, seconds are omitted.
 *
 * @param date1 The first date
 * @param date2 The second date
 * @returns The formatted duration string
 */
export const getFormattedTimeDifference = (
  date1: Date,
  date2: Date,
): string => {
  const diffInMs = Math.abs(date2.getTime() - date1.getTime());

  const MS_PER_SECOND = 1000;
  const MS_PER_MINUTE = 60 * MS_PER_SECOND;
  const MS_PER_HOUR = 60 * MS_PER_MINUTE;
  const MS_PER_DAY = 24 * MS_PER_HOUR;

  const days = Math.floor(diffInMs / MS_PER_DAY);
  const remainingAfterDays = diffInMs % MS_PER_DAY;

  const hours = Math.floor(remainingAfterDays / MS_PER_HOUR);
  const remainingAfterHours = remainingAfterDays % MS_PER_HOUR;

  const minutes = Math.floor(remainingAfterHours / MS_PER_MINUTE);
  const remainingAfterMinutes = remainingAfterHours % MS_PER_MINUTE;

  const seconds = Math.floor(remainingAfterMinutes / MS_PER_SECOND);

  const parts: string[] = [];
  let started = false;

  if (days > 0) {
    parts.push(`${days}d`);
    started = true;
  }
  if (started || hours > 0) {
    parts.push(`${hours}h`);
    started = true;
  }
  if (started || minutes > 0) {
    parts.push(`${minutes}m`);
    started = true;
  }

  if (started || seconds > 0) {
    parts.push(`${seconds}s`);
  }

  if (parts.length === 0) {
    return '0s';
  }

  return parts.slice(0, 4).join(' ');
};
