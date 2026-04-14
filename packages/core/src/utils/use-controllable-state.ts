import * as React from 'react';

import { UseControllableStateParams } from '../types';

export function useControllableState<T>({
  defaultProp,
  onChange,
  prop,
}: UseControllableStateParams<T>): [
  T | undefined,
  (state: T | ((prevState: T) => T)) => void,
] {
  // Track if the component is controlled. We use a ref so we can warn if
  // the user switches from controlled to uncontrolled (standard React behavior).
  const isControlled = prop !== undefined;
  const wasControlled = React.useRef(isControlled);

  React.useEffect(() => {
    if (wasControlled.current !== isControlled) {
      console.warn(
        `Warning: A component changed from ${
          wasControlled.current ? 'controlled' : 'uncontrolled'
        } to ${isControlled ? 'controlled' : 'uncontrolled'}.`,
      );
    }
  }, [isControlled]);

  const [uncontrolledProp, setUncontrolledProp] = React.useState(defaultProp);

  const value = isControlled ? prop : uncontrolledProp;

  // Use a ref to keep track of the latest onChange callback
  // without needing to add it to the dependency array of our setter.
  const onChangeRef = React.useRef(onChange);
  React.useLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  // The unified setter function
  const setValue = React.useCallback(
    (nextValue: T | ((prevState: T) => T)) => {
      // Handle functional updates exactly like React.useState does
      const setter = nextValue as (prevState?: T) => T;
      const resolvedValue =
        typeof nextValue === 'function' ? setter(value) : nextValue;

      if (onChangeRef.current) {
        onChangeRef.current(resolvedValue);
      }

      if (!isControlled) {
        setUncontrolledProp(resolvedValue);
      }
    },
    [isControlled, value],
  );

  return [value, setValue];
}
