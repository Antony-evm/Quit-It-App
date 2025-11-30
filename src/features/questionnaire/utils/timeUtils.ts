export type ParsedTimeWindow = {
  startHour: number;
  endHour: number;
  periodLabel: string;
  hoursLabel: string;
};

export const formatHour = (hour: number) => {
  const normalized = ((hour % 24) + 24) % 24;
  const suffix = normalized >= 12 ? 'PM' : 'AM';
  let hour12 = normalized % 12;
  if (hour12 === 0) hour12 = 12; // Convert 0 to 12 for both midnight and noon
  return `${hour12}${suffix}`;
};

export const parseHourToken = (token: string): number | null => {
  const match = token.trim().match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  const meridiem = match[3].toLowerCase();
  let value = hours % 12;
  value = meridiem === 'pm' ? value + 12 : value;
  return value + minutes / 60;
};

export const parseTimeWindow = (value: string): ParsedTimeWindow => {
  // Prefer the text inside parentheses; fallback to whole string
  const parenMatch = value.match(/\(([^)]+)\)/);
  const rangeText = parenMatch ? parenMatch[1] : value;
  const normalizedRange = rangeText.replace(/[\u2013\u2014]/g, '-'); // normalize en/em dash
  const [rawStart, rawEnd] = normalizedRange
    .split(/-/)
    .map(part => part.trim());

  const start = rawStart ? parseHourToken(rawStart) : null;
  const end = rawEnd ? parseHourToken(rawEnd) : null;

  const safeStart = start ?? 0;
  let safeEnd = end ?? (start !== null ? safeStart + 3 : 24);

  if (safeEnd <= safeStart) {
    if (safeStart >= 6 && safeStart <= 11 && safeEnd === 0) {
      safeEnd = 12;
    } else {
      safeEnd = end === 0 ? 24 : safeStart + 3;
    }
  }

  const periodLabel =
    safeStart < 12 && safeEnd <= 12
      ? 'AM'
      : safeStart >= 12 && safeEnd >= 12
      ? 'PM'
      : 'AM-PM';

  const hoursLabel = `${formatHour(safeStart)} - ${formatHour(
    Math.min(safeEnd, 24),
  )}`;
  return {
    startHour: safeStart,
    endHour: safeEnd,
    periodLabel,
    hoursLabel,
  };
};
