import * as React from 'react';

type PossibleRef<T> = React.Ref<T> | null | undefined;

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
