import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
    const { children, style, ...otherProps } = props;

    const { isDisabled, index, open, registerTriggerRef, state, value } = useAccordionItem(props);

    const itemContextValue = React.useMemo(
      () => ({
        isDisabled,
        index,
        open,
        registerTriggerRef,
        value,
      }),
      [isDisabled, index, open, registerTriggerRef, value],
    );

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      handlers: {},
      disabled: isDisabled,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        expanded: open,
        disabled: isDisabled,
      },
    });

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <View {...mergedProps}>
          {evaluateStyles(children, state)}
        </View>
      </AccordionItemContext.Provider>
    );
  }),
);

AccordionItem.displayName = 'AccordionItem';
