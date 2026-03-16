import * as React from 'react';
import { View, Platform } from 'react-native';
import {
  evaluate,
  evaluateStyles,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import { useAccordionItemContext } from './context';
import type { AccordionTriggerProps } from './types';
import { useAccordionTrigger } from './use-accordion';

/**
 * The interactive element that toggles the accordion item's panel.
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within an `Accordion.Item`.
 *
 * @example
 * ```tsx
 * <Accordion.Trigger>
 *   {({ open }) => <Text>{open ? 'Close' : 'Open'}</Text>}
 * </Accordion.Trigger>
 * ```
 */
export const AccordionTrigger = React.forwardRef<View, AccordionTriggerProps>(
  (props, ref) => {
    const {
      children,
      style,
      disableDefaultFocusRing = false,
      focusRingStyle,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-disabled': ariaDisabled,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'data-panel-open': dataPanelOpen,
      'data-disabled': dataDisabled,
      ...otherProps
    } = props;

    const {
      disabled,
      handlePress,
      handleKeyPress,
      handleFocus,
      handleBlur,
      focused,
      focusVisible,
      state,
      open,
    } = useAccordionTrigger(props);

    const itemContext = useAccordionItemContext();
    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    React.useLayoutEffect(() => {
      itemContext.registerTriggerRef(internalRef);
    }, [itemContext]);

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
      <PressableWithKeyPress
        {...otherProps}
        ref={internalRef}
        disabled={disabled}
        onPress={handlePress}
        onKeyPress={handleKeyPress}
        onKeyDown={handleKeyPress}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={finalStyle}
        accessible
        role='button'
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
        aria-keyshortcuts={ariaKeyshortcuts}
        accessibilityState={{
          expanded: open,
          disabled,
        }}
        aria-expanded={ariaExpanded ?? open}
        data-panel-open={dataPanelOpen ?? (open ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
      >
        {evaluate(children, state)}
      </PressableWithKeyPress>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';
