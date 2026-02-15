import * as React from 'react';

/**
 * A React ref that may be a callback ref, an object ref, or absent.
 */
type PossibleRef<T> = React.Ref<T> | null | undefined;

/**
 * Merges multiple React refs into a single callback ref.
 *
 * The returned ref function will update all provided refs when invoked:
 * - Callback refs are called with the value.
 * - Object refs have their `current` property updated.
 *
 * `null` and `undefined` refs are safely ignored.
 *
 * This is useful when a component needs to forward its ref while also
 * preserving a ref defined on a child element.
 */
export function mergeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;

      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
