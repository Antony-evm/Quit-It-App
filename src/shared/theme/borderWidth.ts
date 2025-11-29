import { StyleSheet } from 'react-native';

/**
 * Shared border width styles for consistent component outlines.
 * Based on existing usage across the app.
 */
export const BORDER_WIDTH = {
  none: 0,

  /**
   * Hairline width (platform dependent)
   * Good for subtle separators
   */
  hairline: StyleSheet.hairlineWidth,

  /**
   * Standard thin border (1px)
   * Used for: Cards, inputs, dividers, buttons
   */
  sm: 1,

  /**
   * Medium border (2px)
   * Used for: Active states, focused inputs, charts
   */
  md: 2,

  /**
   * Thick border (4px)
   * Used for: Left accent borders on cards, indicators
   */
  lg: 4,
} as const;

export type BorderWidth = keyof typeof BORDER_WIDTH;
