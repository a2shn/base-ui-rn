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
 * The button that toggles the accordion item.
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within an `Accordion.Item`.
 *
 * @example
 * ```tsx
 * <Accordion.Trigger>
 * {({ open }) => <Text>{open ? 'Close' : 'Open'}</Text>}
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
    {
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
      onAccessibilityAction: handleAccessibilityAction,
      onBlur: handleBlur,
      onFocus: handleFocus,
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      ref: itemContext.triggerRef,
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

AccordionTrigger.displayName = 'Accordion.Trigger';
