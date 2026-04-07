import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { AccordionHeaderProps } from './types';
import { useAccordionHeader } from './use-accordion-header';

/**
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
    const { children, style, ...otherProps } = props;
    const { isDisabled, open, state } = useAccordionHeader();

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(
    {
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
      style: [
        Platform.OS === 'web' && open ? { zIndex: 1 } : undefined,
        resolvedStyle,
      ]
    },
    { ref },
    otherProps,
    { focusable: false }
  );

    return <View {...mergedProps}>{resolveValue(children, state)}</View>;
  }),
);

AccordionHeader.displayName = 'Accordion.Header';
