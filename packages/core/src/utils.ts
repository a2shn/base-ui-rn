import * as React from 'react';
import {
  Platform,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { DEFAULT_FOCUS_RING_STYLE } from './constants';

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
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
  };
}

/**
 * Converts border styles to outline styles for web compatibility.
 * On web, focus rings should use outline instead of border.
 */
function convertBorderToOutline(style: ViewStyle): ViewStyle {
  if (Platform.OS !== 'web') return style;

  const outlineStyle: ViewStyle = {};
  if (style.borderWidth !== undefined) {
    outlineStyle.outlineWidth = style.borderWidth;
  }
  if (style.borderColor !== undefined) {
    outlineStyle.outlineColor = style.borderColor;
  }
  if (style.borderRadius !== undefined) {
    outlineStyle.outlineOffset = -style.borderRadius;
  }

  return Object.keys(outlineStyle).length > 0 ? outlineStyle : style;
}

/**
 * Resolves the focus ring style based on the provided options.
 *
 * @param focusVisible - Whether the focus ring should be visible.
 * @param disableDefault - Whether to disable the default focus ring style.
 * @param customStyle - Custom style to apply for the focus ring.
 * @param defaultStyle - The default focus ring style to apply.
 * @returns The resolved style or null.
 */
export function resolveFocusRingStyle(
  focusVisible: boolean,
  disableDefault: boolean = false,
  customStyle?: StyleProp<ViewStyle>,
  defaultStyle: StyleProp<ViewStyle> = DEFAULT_FOCUS_RING_STYLE,
) {
  if (!focusVisible) return null;
  if (customStyle) {
    const flatStyle = StyleSheet.flatten(customStyle);
    return convertBorderToOutline(flatStyle as ViewStyle);
  }
  if (disableDefault) return null;
  return defaultStyle;
}

/**
 * Checks if a value is a style (StyleProp<ViewStyle>).
 * Returns true for: null, undefined, numbers (dimension values), style objects, arrays of styles.
 * Returns false for: React elements, strings, booleans, functions.
 */
function isStyle(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === 'number') return true;
  if (typeof value === 'string' || typeof value === 'boolean') return false;
  if (typeof value === 'function') return false;
  if (Array.isArray(value)) return value.every(isStyle);
  if (typeof value === 'object') {
    if (React.isValidElement(value)) return false;
    const obj = value as Record<string, unknown>;
    if ('$$typeof' in obj) return false;
    if ('ref' in obj) return false;
    if ('type' in obj && 'props' in obj) return false;
    return true;
  }
  return false;
}

/**
 * Evaluates a value that can be a static value or a function that returns a value based on state.
 * When used with styles, merges the result with focus ring style if state has focusVisible.
 */
export function evaluateStyles<T extends StyleProp<ViewStyle>, S>(
  value: T | ((state: S) => T),
  state: S,
  options?: {
    disableDefaultFocusRing?: boolean;
    focusRingStyle?: StyleProp<ViewStyle>;
  },
): StyleProp<ViewStyle>;

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
  options?: {
    disableDefaultFocusRing?: boolean;
    focusRingStyle?: StyleProp<ViewStyle>;
  },
): T;

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
  options: {
    disableDefaultFocusRing?: boolean;
    focusRingStyle?: StyleProp<ViewStyle>;
  } = {},
): T | StyleProp<ViewStyle> {
  const { disableDefaultFocusRing, focusRingStyle } = options;
  const resolvedValue =
    typeof value === 'function' ? (value as (state: S) => T)(state) : value;

  if (!isStyle(resolvedValue)) {
    return resolvedValue;
  }

  const focusVisible = (state as { focusVisible?: boolean }).focusVisible;
  if (!focusVisible) {
    return resolvedValue as StyleProp<ViewStyle>;
  }

  const focusRing = resolveFocusRingStyle(
    focusVisible,
    disableDefaultFocusRing,
    focusRingStyle,
  );

  if (focusRing === null) {
    return resolvedValue as StyleProp<ViewStyle>;
  }

  return [resolvedValue, focusRing] as StyleProp<ViewStyle>;
}
