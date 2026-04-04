import {
  evaluateStyles,
  mergeProps,
  mergeRefs,
  PressableWithKeyDown,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { CollapsibleTriggerProps } from './types';
import { useCollapsibleTrigger } from './use-collapsible';

/**
 * A button that opens and closes the collapsible panel.
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within a `Collapsible.Root`.
 *
 * @example
 * ```tsx
 * <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 * ```
 */
export const CollapsibleTrigger = React.memo(
  React.forwardRef<View, CollapsibleTriggerProps>((props, ref) => {
    const {
      children,
      style,
      onPress,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      ...otherProps
    } = props;

    const {
      isDisabled,
      focused,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handleAccessibilityAction,
      open,
      state,
      isFocusable,
      tabIndex,
    } = useCollapsibleTrigger(props);

    const internalRef = React.useRef<View>(null);
    const mergedRef = mergeRefs(internalRef, ref);

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && (open || focused) ? { zIndex: 1 } : undefined,
      ],
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      handlers: {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onAccessibilityAction: handleAccessibilityAction,
      },
      disabled: isDisabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
    });

    return (
      <PressableWithKeyDown
        accessible
        role="button"
        tabIndex={tabIndex}
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
