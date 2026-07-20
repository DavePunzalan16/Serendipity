/**
 * @wander/ui-tokens
 * Design tokens shared between web and mobile apps.
 *
 * Usage (TypeScript):
 *   import { colors, spacing, borderRadius } from '@wander/ui-tokens';
 *
 * Usage (CSS):
 *   @import '@wander/ui-tokens/tokens.css';
 */

export { colors } from './colors';
export type { ColorToken, ColorValue } from './colors';

export { spacing } from './spacing';
export type { SpacingToken, SpacingValue } from './spacing';

export { borderRadius } from './borders';
export type { BorderRadiusToken, BorderRadiusValue } from './borders';

export { fontFamilies, fontSizes, fontWeights, lineHeights } from './typography';
export type {
  FontFamilyToken,
  FontSizeToken,
  FontWeightToken,
  LineHeightToken,
} from './typography';

export { durations, easings } from './motion';
export type { DurationToken, DurationValue, EasingToken, EasingValue } from './motion';
