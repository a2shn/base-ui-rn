import * as React from 'react';

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
