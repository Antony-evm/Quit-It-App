/**
 * Animation duration constants in milliseconds
 * Used for consistent animation timing across the app
 */
export const ANIMATION = {
  /** Fast animations (150-200ms) - Quick transitions, subtle effects */
  fast: 150,
  /** Short animations (200-250ms) - Button presses, small UI changes */
  short: 200,
  /** Medium animations (300-350ms) - Modal transitions, larger UI changes */
  medium: 300,
  /** Long animations (400-500ms) - Page transitions, complex animations */
  long: 500,
} as const;

/**
 * Animation easing constants
 * For use with Animated.timing or other animation libraries
 */
export const EASING = {
  /** Standard easing for most animations */
  standard: 'ease-in-out',
  /** Accelerate at the start */
  accelerate: 'ease-in',
  /** Decelerate at the end */
  decelerate: 'ease-out',
  /** Linear motion */
  linear: 'linear',
} as const;
