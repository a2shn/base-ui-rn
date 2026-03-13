import * as React from 'react';
import { View } from 'react-native';
import { AccordionItemContext } from './context';
import type { AccordionItemProps } from './types';
import { useAccordionItem } from './use-accordion';

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

    const { value, open, disabled, index, registerTriggerRef, state } =
      useAccordionItem(props);

    const itemContextValue = React.useMemo(
      () => ({
        value,
        open,
        disabled,
        index,
        registerTriggerRef,
      }),
      [value, open, disabled, index, registerTriggerRef],
    );

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <AccordionItemContext.Provider value={itemContextValue}>
        <View
          {...otherProps}
          ref={ref}
          style={resolvedStyle}
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
