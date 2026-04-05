import * as React from 'react';
import {
  evaluateStyles,
  mergeProps,
  mergeRefs,
  PressableWithKeyDown,
  useStyle,
} from '@base-ui-rn/core';
import { Platform, View } from 'react-native';

import { useAccordionItemContext } from './context';
import type { AccordionTriggerProps } from './types';
import { useAccordionTrigger } from './use-accordion';/**
 * The interactive element that toggles the accordion item's panel.
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
    const { children, style } = props;

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
      handleAccessibilityAction
    } = useAccordionTrigger(props);

    const itemContext = useAccordionItemContext();

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
      onKeyDown: handleKeyDown,
      onPress: handlePress,
      onAccessibilityAction: handleAccessibilityAction,
      ref: mergeRefs(ref, itemContext.triggerRef),
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

AccordionTrigger.displayName = 'Accordion.Trigger';
