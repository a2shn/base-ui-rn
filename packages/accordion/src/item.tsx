import * as React from 'react';
import { View, Platform } from 'react-native';
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
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-open': dataOpen,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      ...otherProps
    } = props;

    const {
      value,
      open,
      focused,
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
        focused,
        index,
        registerTriggerRef,
        setFocused,
      }),
      [value, open, disabled, focused, index, registerTriggerRef, setFocused],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      resolvedStyle,
      Platform.select({
        web: focused ? { zIndex: 1 } : undefined,
      }),
    ];

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <View
          {...otherProps}
          ref={ref}
          style={finalStyle}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded ?? open}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-open={dataOpen ?? (open ? 'true' : undefined)}
          data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
          data-index={dataIndex ?? index}
        >
          {resolvedChildren}
        </View>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
