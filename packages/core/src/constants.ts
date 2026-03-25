import { Platform } from 'react-native';

/**
 * Default hit slop for components.
 * Expands the interactive touch area to improve accessibility.
 *
 * @default
 * { top: 10, bottom: 10, left: 10, right: 10 }
 */
export const DEFAULT_HIT_SLOP = {
  bottom: 10,
  left: 10,
  right: 10,
  top: 10,
} as const;

/**
 * Default focus ring styling used across components.
 * On web, it uses 'outline' to avoid layout shifts and double rings.
 * On native, it uses 'border' as a fallback.
 */
export const DEFAULT_FOCUS_RING_STYLE = Platform.select({
  default: {
    borderColor: '#1a73e8',
    borderWidth: 3,
  },
  web: null,
});
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
  'GamepadA', // Common gamepad cross-platform maps
  'buttonA',
  'buttonX',
  'Cross', // Playstation
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
