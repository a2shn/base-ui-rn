import * as React from 'react';
import { View, Platform } from 'react-native';
import { evaluate, evaluateStyles } from '@base-ui-rn/core';
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
export const AccordionItem = React.forwardRef<View, AccordionItemProps>(
  (props, ref) => {
    const {
      children,
      style,
      disableDefaultFocusRing = false,
      focusRingStyle,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-disabled': ariaDisabled,
      'aria-keyshortcuts': ariaKeyshortcuts,
      tabIndex,
      'data-open': dataOpen,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      ...otherProps
    } = props;

    const {
      value,
      open,
      focused,
      focusVisible,
      disabled,
      index,
      registerTriggerRef,
      setFocused,
      handleFocus,
      handleBlur,
      state,
    } = useAccordionItem(props);

    const itemContextValue = React.useMemo(
      () => ({
        value,
        open,
        disabled,
        focused,
        index,
        registerTriggerRef,
        setFocused,
      }),
      [value, open, disabled, focused, index, registerTriggerRef, setFocused],
    );

    const finalStyle = [
      evaluateStyles(style, state, {
        disableDefaultFocusRing,
        focusRingStyle,
      }),
      Platform.select({
        web: focused || focusVisible ? { zIndex: 1 } : undefined,
      }),
    ];

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <View
          {...otherProps}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={finalStyle}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded ?? open}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
          aria-keyshortcuts={ariaKeyshortcuts}
          tabIndex={tabIndex}
          data-open={dataOpen ?? (open ? 'true' : undefined)}
          data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
          data-index={dataIndex ?? index}
        >
          {evaluate(children, state)}
        </View>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
