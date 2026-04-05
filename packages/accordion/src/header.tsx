import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { AccordionHeaderProps } from './types';
import { useAccordionHeader } from './use-accordion';/**
 * An optional wrapper for the Accordion.Trigger.
 *
 * Typically used to provide semantic structure (e.g., heading levels)
 * while inheriting the item's state.
 *
 * @example
 * ```tsx
 * <Accordion.Header>
 *   <Accordion.Trigger>...</Accordion.Trigger>
 * </Accordion.Header>
 * ```
 */
export const AccordionHeader = React.memo(
  React.forwardRef<View, AccordionHeaderProps>((props, ref) => {
    const { children, style } = props;
    const { isDisabled, open, state } = useAccordionHeader();

    const resolvedStyle = useStyle({
      additionalStyles: [Platform.OS === 'web' && open ? { zIndex: 1 } : undefined],
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: isDisabled,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
    });

    return (
      <View {...mergedProps}>
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

AccordionHeader.displayName = 'Accordion.Header';
