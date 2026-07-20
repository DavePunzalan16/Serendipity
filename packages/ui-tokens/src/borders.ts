/**
 * Border radius tokens for the Wander design system.
 * Values are in pixels (except `full` which creates a circle/pill shape).
 */
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export type BorderRadiusToken = keyof typeof borderRadius;
export type BorderRadiusValue = (typeof borderRadius)[BorderRadiusToken];
