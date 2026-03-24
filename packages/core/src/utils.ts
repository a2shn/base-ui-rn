import * as React from 'react';
import { type StyleProp, StyleSheet, type ViewStyle } from 'react-native';

import { DEFAULT_FOCUS_RING_STYLE } from './constants';
import type { FocusVisibleProps } from './types';

/**
 * Clamps a value between a minimum and maximum bound.
 */
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/**
 * Merges multiple refs into a single ref callback.
 *
 * @param refs - The refs to merge. Can be function refs or object refs.
 * @returns A single ref callback that updates all provided refs.
 *
 * @example
 * ```tsx
 * const combinedRef = mergeRefs(ref1, ref2, internalRef);
 * <View ref={combinedRef} />
 * ```
 */
export function mergeRefs<T>(
  ...refs: Array<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.RefObject<T | null>).current = node;
      }
    }
  };
}

/**
 * Resolves the focus ring style based on the provided options.
 */
export function resolveFocusRingStyle(
  focusVisible: boolean,
  disableDefault: boolean = false,
  customStyle?: StyleProp<ViewStyle>,
  defaultStyle: StyleProp<ViewStyle> = DEFAULT_FOCUS_RING_STYLE,
) {
  if (!focusVisible) return null;
  if (customStyle) return customStyle;
  if (disableDefault) return null;
  return defaultStyle;
}

/**
 * Checks if a value is a StyleProp<ViewStyle>.
 */
function isStyle(value: unknown): boolean {
  if (value == null) return false;
  const t = typeof value;
  if (t === 'number') return true;
  if (t !== 'object') return false; // covers string, boolean, function
  if (Array.isArray(value)) return (value as unknown[]).every(isStyle);
  // $$typeof covers React elements, forwardRef, memo, etc.
  return !('$$typeof' in (value as object));
}

/**
 * Evaluates a value that can be a static value or a function that returns a value based on state.
 * When used with styles, merges the result with focus ring style if state has focusVisible.
 */
export function evaluateStyles<T extends StyleProp<ViewStyle>, S>(
  value: T | ((state: S) => T),
  state: S,
  options?: Omit<FocusVisibleProps, 'focusVisible'>,
): StyleProp<ViewStyle>;

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
  options?: Omit<FocusVisibleProps, 'focusVisible'>,
): T;

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
  options: Omit<FocusVisibleProps, 'focusVisible'> = {},
): any {
  const resolvedValue =
    typeof value === 'function' ? (value as (state: S) => T)(state) : value;

  // Fast path: skip all focus-ring logic when not focused.
  if (!(state as { focusVisible?: boolean }).focusVisible) {
    return resolvedValue;
  }

  const focusRing = resolveFocusRingStyle(
    true,
    options.disableDefaultFocusRing,
    options.focusRingStyle,
  );

  if (focusRing === null) return resolvedValue;

  if (!isStyle(resolvedValue)) {
    return resolvedValue == null ? focusRing : resolvedValue;
  }

  return [resolvedValue, focusRing];
}
