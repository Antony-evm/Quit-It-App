import { getFormattedTimeDifference } from '../src/utils/dateUtils';

describe('getFormattedTimeDifference', () => {
  it('should return seconds only when difference is small', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T00:00:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('10s');
  });

  it('should return minutes and seconds', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T00:05:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('5mins 10s');
  });

  it('should return hours, minutes and seconds', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T01:05:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('1hrs 5mins 10s');
  });

  it('should return days, hours, minutes and seconds', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-02T01:05:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('1d 1hrs 5mins 10s');
  });

  it('should omit seconds if more than a week', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-10T01:05:10');
    // 9 days, 1 hour, 5 mins, 10s
    expect(getFormattedTimeDifference(date1, date2)).toBe('9d 1hrs 5mins');
  });

  it('should show zero minutes if hours are present', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T01:00:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('1hrs 0mins 10s');
  });

  it('should show zero seconds if minutes are present', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T00:05:00');
    expect(getFormattedTimeDifference(date1, date2)).toBe('5mins 0s');
  });

  it('should show zero hours and minutes if days are present', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-02T00:00:10');
    expect(getFormattedTimeDifference(date1, date2)).toBe('1d 0hrs 0mins 10s');
  });

  it('should omit leading zero units', () => {
    const date1 = new Date('2023-01-01T00:00:00');
    const date2 = new Date('2023-01-01T00:00:10');
    // 0d 0hrs 0mins 10s -> 10s
    expect(getFormattedTimeDifference(date1, date2)).toBe('10s');
  });
});
