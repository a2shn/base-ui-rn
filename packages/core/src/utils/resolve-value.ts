/**
 * Resolves a value that can be static or derived from component state.
 * This utility evaluates both styles and render props (children) that depend on state.
 *
 * @template T - The resolved value type (style or children).
 * @template S - Component state type used to derive dynamic values.
 *
 * @param value - Static value or function that derives value from state.
 * @param state - Component state passed to the value function.
 *
 * @returns The resolved value (either static or derived from state).
 *
 * @example
 * ```tsx
 * type ButtonState = { disabled: boolean; focused: boolean };
 *
 * const style = resolveValue(
 *   (state) => ({ opacity: state.disabled ? 0.5 : 1 }),
 *   { disabled, focused },
 * );
 *
 * const children = resolveValue(
 *   (state) => state.disabled ? 'Disabled' : 'Click me',
 *   { disabled, focused },
 * );
 * ```
 */
export function resolveValue<T, S>(value: T | ((state: S) => T), state: S): T {
  if (typeof value === 'function') {
    return (value as (state: S) => T)(state);
  }
  return value;
}
