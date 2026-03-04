import * as React from 'react';
import type { FocusRingProps, FocusRingRenderProps } from './types';

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
  const [focused, setFocused] = React.useState(false);
  const [isFocusVisible, setFocusVisible] = React.useState(forceFocusVisible);

  /**
   * Internal focus handler that updates state and manages focus-visible heuristic.
   */
  const onFocus = React.useCallback(() => {
    setFocused(true);
    // In React Native, true focus-visible logic often requires tracking global
    // interaction state (pointer vs keyboard). For this implementation, we
    // default to true when focused to ensure accessibility, which can be
    // further specialized with platform-specific native listeners.
    setFocusVisible(true);
  }, []);

  /**
   * Internal blur handler.
   */
  const onBlur = React.useCallback(() => {
    setFocused(false);
    setFocusVisible(false);
  }, []);

  const renderProps: FocusRingRenderProps = {
    focused,
    focusVisible: isFocusVisible || forceFocusVisible,
  };

  const child =
    typeof children === 'function' ? children(renderProps) : children;

  if (!React.isValidElement(child)) {
    return child as unknown as React.ReactElement;
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
