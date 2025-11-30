export type FormattedDateLabels = {
  dateLabel: string;
  timeLabel: string;
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
  const MS_PER_WEEK = 7 * MS_PER_DAY;

  const isMoreThanOneWeek = diffInMs > MS_PER_WEEK;

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
    parts.push(`${hours}hrs`);
    started = true;
  }
  if (started || minutes > 0) {
    parts.push(`${minutes}mins`);
    started = true;
  }

  if (!isMoreThanOneWeek && (started || seconds > 0)) {
    parts.push(`${seconds}s`);
  }

  if (parts.length === 0) {
    return '0s';
  }

  return parts.join(' ');
};
