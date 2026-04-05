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
    } = props;

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

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && (open || focused) ? { zIndex: 1 } : undefined,
      ],
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      onBlur: handleBlur,
      onFocus: handleFocus,
      onPress: handlePress,
      onAccessibilityAction: handleAccessibilityAction,
      ref: [internalRef, ref],
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
        {...mergedProps}
        tabIndex={tabIndex}
        disabled={isDisabled}
        focusable={isFocusable}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyDown>
    );
  }),
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
