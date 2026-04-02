import { StyleProp } from 'react-native';

type StyleArgs<TState, TStyle> = {
  style: StyleProp<TStyle> | ((state: TState) => StyleProp<TStyle>);
  state: TState;
  additionalStyles?: StyleProp<TStyle> | StyleProp<TStyle>[];
};

export function evaluateStyles<T, S>(
  value: T | ((state: S) => T),
  state: S,
): T {
  if (typeof value === 'function') {
    return (value as (state: S) => T)(state);
  }
  return value;
}

/**
 * Resolves a style value that can be static or derived from component state,
 * and optionally merges additional styles.
 *
 * @template TState - Component state type used to derive dynamic styles.
 * @template TStyle - Style type (React Native StyleProp shape).
 *
 * @param args - Configuration object for style resolution.
 * @param args.style - Base style or function returning a style from state.
 * @param args.state - Component state passed to the style function.
 * @param args.additionalStyles - Optional styles to merge with the base style.
 *
 * @returns A memoized style or array of styles suitable for React Native components.
 *
 * @example
 * ```tsx
 * type ButtonState = {
 * disabled: boolean;
 * focused: boolean;
 * };
 *
 * const style = useStyle<ButtonState>({
 * style: (state) => ({
 * opacity: state.disabled ? 0.5 : 1,
 * }),
 * state: { disabled, focused },
 * additionalStyles: props.style,
 * });
 *
 * return <View style={style} />;
 * ```
 */
export function useStyle<TState, TStyle = unknown>(
  args: StyleArgs<TState, TStyle>,
): StyleProp<TStyle> {
  const { additionalStyles, state, style } = args;

  const baseStyle = evaluateStyles(style, state);

  if (!additionalStyles) {
    return baseStyle;
  }

  if (Array.isArray(additionalStyles)) {
    return [baseStyle, ...additionalStyles] as StyleProp<TStyle>;
  }

  return [baseStyle, additionalStyles] as StyleProp<TStyle>;
}
