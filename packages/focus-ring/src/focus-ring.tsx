import * as React from 'react';
import type { FocusRingProps, FocusRingRenderProps } from './types';

/**
 * FocusRing is a headless utility component that manages focus state and focus-visible logic.
 *
 * It provides a way to show a focus indicator (the "focus ring") only when focusing 
 * via keyboard or non-touch navigation, mirroring the behavior of `:focus-visible` in CSS.
 *
 * @param focusVisible
 * When true, forces the focus ring to be visible even if not focusing via keyboard.
 *
 * @example
 * ```tsx
 * <FocusRing>
 *   {({ focusVisible }) => (
 *     <View style={{ borderColor: focusVisible ? 'blue' : 'transparent' }} />
 *   )}
 * </FocusRing>
 * ```
 */
export const FocusRing: React.FC<FocusRingProps> = (props) => {
  const { children, focusVisible: forceFocusVisible = false } = props;
  const [focused, setFocused] = React.useState(false);
  const [isFocusVisible, setFocusVisible] = React.useState(forceFocusVisible);

  const onFocus = React.useCallback(() => {
    setFocused(true);
    // In React Native, the focus-visible logic often depends on tracking 
    // global interaction state. For this implementation, we default to 
    // true when focused, but this can be enhanced with global listeners.
    setFocusVisible(true);
  }, []);

  const onBlur = React.useCallback(() => {
    setFocused(false);
    setFocusVisible(false);
  }, []);

  const renderProps: FocusRingRenderProps = {
    focused,
    focusVisible: isFocusVisible || forceFocusVisible,
  };

  const child = typeof children === 'function' ? children(renderProps) : children;

  if (!React.isValidElement(child)) {
    return child;
  }

  const childElement = child as React.ReactElement<{
    onFocus?: (e: unknown) => void;
    onBlur?: (e: unknown) => void;
  }>;

  // Inject onFocus and onBlur into the child while preserving existing handlers
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
