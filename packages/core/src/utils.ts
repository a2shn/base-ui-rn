import * as React from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';

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
 * Evaluates a value that can be a static value or a function that returns a value based on state.
 */
export function evaluateStyles<T extends StyleProp<ViewStyle>, S>(
  value: T | ((state: S) => T),
  state: S,
): StyleProp<ViewStyle>;

export function evaluateStyles<T, S>(value: T | ((state: S) => T), state: S): T;

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
): unknown {
  if (typeof value === 'function') {
    return (value as (state: S) => T)(state);
  }
  return value;
}
