import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { AccordionHeaderProps } from './types';
import { useAccordionHeader } from './use-accordion';

/**
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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      'data-open': dataOpen,
      style,
      ...otherProps
    } = props;

    const { disabled, index, open, state } = useAccordionHeader({});

    const resolvedChildren = evaluateStyles(children, state);


    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
        aria-expanded={ariaExpanded ?? open}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
        data-index={dataIndex ?? index}
        data-open={dataOpen ?? (open ? 'true' : undefined)}
        ref={ref}
        style={[evaluateStyles(style, state), { zIndex: 1 }]}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

AccordionHeader.displayName = 'AccordionHeader';
