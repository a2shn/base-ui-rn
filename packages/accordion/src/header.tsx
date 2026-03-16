import * as React from 'react';
import { View, Platform } from 'react-native';
import { evaluate, evaluateStyles } from '@base-ui-rn/core';
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
      focusVisible: forceFocusVisible = false,
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
      state,
      open,
      focused,
      focusVisible,
      disabled,
      index,
      handleFocus,
      handleBlur,
    } = useAccordionHeader({ focusVisible: forceFocusVisible });

    const resolvedChildren = evaluate(children, state);

    const finalStyle = [
      evaluateStyles(style, state, {
        disableDefaultFocusRing,
        focusRingStyle,
      }),
      Platform.select({
        web: open || focused || focusVisible ? { zIndex: 1 } : undefined,
      }),
    ];

    return (
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
        {resolvedChildren}
      </View>
    );
  },
);

AccordionHeader.displayName = 'AccordionHeader';
