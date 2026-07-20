/**
 * Motion tokens for the Wander design system.
 * Durations are in milliseconds. Easings are CSS timing functions.
 */
export const durations = {
  fast: 150,
  normal: 300,
  slow: 500,
  slower: 700,
} as const;

export const easings = {
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
} as const;

export type DurationToken = keyof typeof durations;
export type DurationValue = (typeof durations)[DurationToken];
export type EasingToken = keyof typeof easings;
export type EasingValue = (typeof easings)[EasingToken];
