import * as React from 'react';
import { mergeProps } from './merge-props';
import { mergeRefs } from './merge-refs';

export interface SlotProps extends Record<string, unknown> {
  children: React.ReactElement;
}

export const Slot = React.forwardRef<unknown, SlotProps>(function Slot(
  { children, ...injected },
  forwardedRef,
) {
  if (!React.isValidElement(children)) {
    throw new Error('Slot expects a single valid React element.');
  }

  if (__DEV__ && children.type === React.Fragment) {
    throw new Error('Slot does not support Fragment.');
  }

  const child = children;

  const mergedProps = mergeProps(
    injected,
    child.props as Record<string, unknown>,
  );

  const ref = mergeRefs(
    forwardedRef,
    (child as { ref?: React.Ref<unknown> }).ref,
  );

  return React.cloneElement(child, {
    ...mergedProps,
    ref,
  } as unknown as React.Attributes);
});
