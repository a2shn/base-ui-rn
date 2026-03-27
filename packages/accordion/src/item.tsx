import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { AccordionItemContext } from './context';
import type { AccordionItemProps } from './types';
import { useAccordionItem } from './use-accordion';

/**
 * A single item within an accordion.
 *
 * Manages the open/closed state for a specific section and provides context
 * to its Trigger, Header, and Panel sub-components.
 *
 * @example
 * ```tsx
 * <Accordion.Item value="item-1">
 *   <Accordion.Header>...</Accordion.Header>
 *   <Accordion.Panel>...</Accordion.Panel>
 * </Accordion.Item>
 * ```
 */
export const AccordionItem = React.memo(
  React.forwardRef<View, AccordionItemProps>((props, ref) => {
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

    const { disabled, index, open, registerTriggerRef, state, value } =
      useAccordionItem(props);

    const itemContextValue = React.useMemo(
      () => ({
        disabled,
        index,
        open,
        registerTriggerRef,
        value,
      }),
      [value, open, disabled, index, registerTriggerRef],
    );

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
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
          style={evaluateStyles(style, state)}
        >
          {evaluateStyles(children, state)}
        </View>
      </AccordionItemContext.Provider>
    );
  }),
);

AccordionItem.displayName = 'AccordionItem';
