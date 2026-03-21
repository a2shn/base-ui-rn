import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

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
export const AccordionTrigger = React.memo(
  React.forwardRef<View, AccordionTriggerProps>((props, ref) => {
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
      'data-panel-open': dataPanelOpen,
      disableDefaultFocusRing = false,
      focusRingStyle,
      style,
      tabIndex,
      ...otherProps
    } = props;

    const {
      disabled,
      focused,
      focusVisible,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      open,
      state,
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
        accessibilityState={{
          disabled,
          expanded: open,
        }}
        accessible
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
        data-panel-open={dataPanelOpen ?? (open ? 'true' : undefined)}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        role='button'
        style={finalStyle}
        tabIndex={tabIndex}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyPress>
    );
  }),
);

AccordionTrigger.displayName = 'AccordionTrigger';
