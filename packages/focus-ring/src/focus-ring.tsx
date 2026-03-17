import * as React from 'react';
import type { FocusRingProps } from './types';
import { useFocus } from './use-focus';

/**
 * Headless utility component that manages focus state and focus-visible logic.
 *
 * It provides a way to show a focus indicator (the "focus ring") only when focusing
 * via keyboard or non-touch navigation, mirroring the behavior of `:focus-visible` in CSS.
 * This is particularly useful for building accessible UIs that don't show distracting
 * outlines on touch but provide high-visibility focus states for hardware users.
 *
 * @example
 * ```tsx
 * <FocusRing>
 *   {({ focusVisible }) => (
 *     <View style={{
 *       borderWidth: 2,
 *       borderColor: focusVisible ? '#0071E3' : 'transparent'
 *     }} />
 *   )}
 * </FocusRing>
 * ```
 */
export const FocusRing: React.FC<FocusRingProps> = (props) => {
  const { children, focusVisible: forceFocusVisible = false } = props;
  const { focused, focusVisible, onFocus, onBlur } = useFocus({
    focusVisible: forceFocusVisible,
  });

  const child =
    typeof children === 'function'
      ? children({ focused, focusVisible })
      : children;

  if (!React.isValidElement(child)) {
    return child as unknown as React.ReactElement;
  }

  const childElement = child as React.ReactElement<{
    onFocus?: (e: unknown) => void;
    onBlur?: (e: unknown) => void;
  }>;

  return React.cloneElement(childElement, {
    onFocus: (e: unknown) => {
      onFocus();
      childElement.props.onFocus?.(e);
    },
    onBlur: (e: unknown) => {
      onBlur();
      childElement.props.onBlur?.(e);
    },
  });
};

FocusRing.displayName = 'FocusRing';
