/**
 * Timezone utilities for handling timestamps in tracking notes.
 *
 * For timezone-aware backends:
 * - Send: Use Date.toISOString() to send UTC timestamps
 * - Receive: Use new Date(timestamp) to automatically convert UTC to local time
 */

/**
 * Converts a UTC timestamp string from the API to a Date object.
 * JavaScript automatically converts UTC timestamps to local timezone.
 *
 * @param utcTimestamp - ISO string timestamp from the API in UTC
 * @returns Date object automatically converted to local timezone
 *
 * @example
 * // If API returns "2023-01-01T15:30:00.000Z" (UTC)
 * // And user is in EST (UTC-5), this returns Date representing 2023-01-01 10:30:00 EST
 */
export const parseTimestampFromAPI = (utcTimestamp: string): Date => {
  return new Date(utcTimestamp);
};

/**
 * Creates a relative date label (Today, Yesterday, etc.) with time
 *
 * @param eventAt - ISO timestamp string from API (UTC)
 * @returns Formatted string like "Today at 2:30 PM" or "Yesterday at 10:15 AM"
 */
export const formatRelativeDateTimeForDisplay = (eventAt: string): string => {
  const date = parseTimestampFromAPI(eventAt);

  if (isNaN(date.getTime())) {
    return eventAt;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const recordDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  const diffTime = today.getTime() - recordDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dateLabel = '';
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

  return `${dateLabel} at ${timeLabel}`;
};
