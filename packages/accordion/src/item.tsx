import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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

    const {
      value,
      open,
      disabled,
      index,
      registerTriggerRef,
      setFocused,
      state,
    } = useAccordionItem(props);

    const itemContextValue = React.useMemo(
      () => ({
        value,
        open,
        disabled,
        focused: false,
        index,
        registerTriggerRef,
        setFocused,
      }),
      [value, open, disabled, index, registerTriggerRef, setFocused],
    );

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
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
          {evaluateStyles(children, state)}
        </View>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
