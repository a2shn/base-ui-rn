import {
  PressableWithKeyDown,
  mergeProps,
  resolveValue,
} from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { CollapsibleTriggerProps } from './types';
import { useCollapsibleTrigger } from './use-collapsible-trigger';

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
    const { children, style, ...otherProps } = props;

    const {
      isDisabled,
      focused,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handlePress,
      handleAccessibilityAction,
      open,
      state,
      isFocusable,
      tabIndex,
    } = useCollapsibleTrigger(props);

    const internalRef = React.useRef<View>(null);

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
    {
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPress: handlePress,
      ref: internalRef,
      style: [
        focusRingStyle,
        Platform.OS === 'web' && (open || focused) ? { zIndex: 1 } : undefined,
        resolvedStyle,
      ],
    },
    { ref },
    otherProps,
    {
      accessible: true,
      role: "button"
    }
  );

    return (
      <PressableWithKeyDown
        {...mergedProps}
        tabIndex={tabIndex}
        disabled={isDisabled}
        focusable={isFocusable}
      >
        {resolveValue(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
