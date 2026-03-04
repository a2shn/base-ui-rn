/**
 * Default hit slop for components.
 * Expands the interactive touch area to improve accessibility.
 *
 * @default
 * { top: 10, bottom: 10, left: 10, right: 10 }
 */
export const DEFAULT_HIT_SLOP = {
  top: 10,
  bottom: 10,
  left: 10,
  right: 10,
} as const;

/**
 * Default focus ring styling used across components.
 */
export const DEFAULT_FOCUS_RING_STYLE = {
  borderWidth: 2,
  borderColor: '#0071E3',
} as const;

/**
 * Keys that should activate a button or toggle component.
 * Supports a wide range of platforms including mobile, web, and TV.
 */
export const ACTIVATION_KEYS = [
  'Enter',
  ' ',
  'Spacebar',
  'Space',
  'Select',
  'Return',
  'OK',
  'Accept',
] as const;

/**
 * Type for activation keys.
 */
export type ActivationKey = (typeof ACTIVATION_KEYS)[number];

/**
 * Checks if a given key is an activation key.
 *
 * @param key - The key to check
 * @returns True if the key is an activation key
 *
 * @example
 * ```tsx
 * const shouldActivate = isActivationKey(event.nativeEvent.key);
 * ```
 */
export const isActivationKey = (key: string): key is ActivationKey => {
  return ACTIVATION_KEYS.includes(key as ActivationKey);
};
