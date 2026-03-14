import * as React from 'react';
import { View, Platform } from 'react-native';
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

    const { state, open, focused, disabled, index } = useAccordionHeader();

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      resolvedStyle,
      Platform.select({
        web: open || focused ? { zIndex: 1 } : undefined,
      }),
    ];

    return (
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
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';
