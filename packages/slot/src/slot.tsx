import * as React from 'react';
import { mergeProps } from './merge-props';
import { mergeRefs } from './merge-refs';

/**
 * Props for the Slot component.
 *
 * `Slot` expects exactly one valid React element as its child.
 * Any additional props passed to `Slot` will be merged into the child’s props,
 * with child props taking precedence where appropriate.
 */
export interface SlotProps extends Record<string, unknown> {
  /**
   * A single valid React element that will receive the injected props and ref.
   */
  children: React.ReactElement;
}

/**
 * Slot is a utility component that transparently passes props and refs
 * down to its single child element.
 *
 * Behavior:
 * - Merges incoming props with the child’s existing props.
 * - Merges the forwarded ref with the child’s own ref.
 * - Throws if the child is not a valid React element.
 * - Throws in development if the child is a Fragment.
 */
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
