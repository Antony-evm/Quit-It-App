/**
 * Capitalizes the first character of a string and lowercases the rest.
 * @param str - The string to capitalize
 * @returns The string with the first character capitalized
 */
export const capitalizeFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
