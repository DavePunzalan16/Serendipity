/**
 * Color tokens for the Wander design system.
 * Shared across web and mobile platforms.
 */
export const colors = {
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  surfaceDark: '#1A1A2E',
  text: '#2D3436',
  textSecondary: '#636E72',
  textOnPrimary: '#FFFFFF',
  success: '#00B894',
  warning: '#FDCB6E',
  error: '#E17055',
  border: '#DFE6E9',
} as const;

export type ColorToken = keyof typeof colors;
export type ColorValue = (typeof colors)[ColorToken];
