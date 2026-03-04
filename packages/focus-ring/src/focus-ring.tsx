import * as React from 'react';
import type { FocusRingProps, FocusRingRenderProps } from './types';

/**
 * FocusRing is a utility component that manages focus state and focus-visible logic.
 * It provides a way to show a focus indicator only when focusing via keyboard or
 * non-touch navigation.
 */
export const FocusRing: React.FC<FocusRingProps> = (props) => {
  const { children, focusVisible: forceFocusVisible = false } = props;
  const [focused, setFocused] = React.useState(false);
  const [isFocusVisible, setFocusVisible] = React.useState(forceFocusVisible);

  const onFocus = React.useCallback(() => {
    setFocused(true);
    // In a real implementation, we would check the interaction source.
    // For this prototype, we'll assume focus is visible if it's not forced off.
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

  const child =
    typeof children === 'function' ? children(renderProps) : children;

  if (!React.isValidElement(child)) {
    return child;
  }

  const childElement = child as React.ReactElement<{
    onFocus?: (e: unknown) => void;
    onBlur?: (e: unknown) => void;
  }>;

  // Inject onFocus and onBlur into the child
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
