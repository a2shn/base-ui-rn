import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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
export const AccordionHeader = React.forwardRef<View, AccordionHeaderProps>(
  (props, ref) => {
    const {
      children,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-disabled': ariaDisabled,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'data-open': dataOpen,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      ...otherProps
    } = props;

    const { state, open, disabled, index } = useAccordionHeader({});

    const resolvedChildren = evaluateStyles(children, state);

    return (
      <View
        {...otherProps}
        ref={ref}
        style={evaluateStyles(style, state)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded ?? open}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
        aria-keyshortcuts={ariaKeyshortcuts}
        data-open={dataOpen ?? (open ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
        data-index={dataIndex ?? index}
      >
        {resolvedChildren}
      </View>
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';
