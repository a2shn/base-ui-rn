import type * as React from 'react';
import {
  Platform,
  StyleSheet,
  type StyleProp,
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
 * Evaluates a value that can be a static value or a function that returns a value based on state.
 *
 * @param value - The value or function to evaluate.
 * @param state - The state to pass to the function.
 * @returns The resolved value.
 *
 * @example
 * ```tsx
 * const resolvedStyle = evaluate(style, state);
 * ```
 */
export function evaluate<T, S>(value: T | ((state: S) => T), state: S): T {
  return typeof value === 'function'
    ? (value as (state: S) => T)(state)
    : value;
}

/**
 * Evaluates styles and merges them with the focus ring style if applicable.
 */
export function evaluateStyles<S extends { focusVisible: boolean }>(
  style: StyleProp<ViewStyle> | ((state: S) => StyleProp<ViewStyle>),
  state: S,
  options: {
    disableDefaultFocusRing?: boolean;
    focusRingStyle?: StyleProp<ViewStyle>;
  } = {},
): StyleProp<ViewStyle> {
  const { disableDefaultFocusRing, focusRingStyle } = options;
  return [
    evaluate(style, state),
    resolveFocusRingStyle(
      state.focusVisible,
      disableDefaultFocusRing,
      focusRingStyle,
    ),
  ];
}
