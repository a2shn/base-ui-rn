import * as React from 'react';
import {
  PressableWithKeyDown,
  mergeProps,
  resolveValue,
} from '@base-ui-rn/core';
import { Platform, View } from 'react-native';

import { useAccordionItemContext } from './context';
import type { AccordionTriggerProps } from './types';
import { useAccordionTrigger } from './use-accordion-trigger';

/**
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within an `Accordion.Item`.
 *
 * @example
 * ```tsx
 * <Accordion.Trigger>
 *   {({ open }) => <Text>{open ? 'Close' : 'Open'}</Text>}
 * </Accordion.Trigger>
 * ```
 */
export const AccordionTrigger = React.memo(
  React.forwardRef<View, AccordionTriggerProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      isDisabled,
      focused,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      open,
      state,
      isFocusable,
      tabIndex,
      handleAccessibilityAction,
    } = useAccordionTrigger(props);

    const itemContext = useAccordionItemContext();

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
      otherProps,
      { ref },
      {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onAccessibilityAction: handleAccessibilityAction,
        ref: itemContext.triggerRef,
        role: 'button',
        style: [
          focusRingStyle,
          Platform.OS === 'web' && (open || focused)
            ? { zIndex: 1 }
            : undefined,
          resolvedStyle,
        ],
        accessibilityState: {
          disabled: isDisabled,
          expanded: open,
        },
        accessible: true,
      },
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

AccordionTrigger.displayName = 'Accordion.Trigger';
