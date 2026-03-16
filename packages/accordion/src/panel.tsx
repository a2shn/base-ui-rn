import * as React from 'react';
import { View } from 'react-native';
import { evaluate, evaluateStyles } from '@base-ui-rn/core';
import type { AccordionPanelProps } from './types';
import { useAccordionPanel } from './use-accordion';

/**
 * The content area that is revealed when an accordion item is expanded.
 *
 * Supports conditional rendering, dimension measurement variables, and
 * accessibility attributes. Must be used within an `Accordion.Item`.
 *
 * @example
 * ```tsx
 * <Accordion.Panel>
 *   <Text>Panel content here</Text>
 * </Accordion.Panel>
 * ```
 */
export const AccordionPanel = React.forwardRef<View, AccordionPanelProps>(
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
      'data-orientation': dataOrientation,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      'data-starting-style': dataStartingStyle,
      'data-ending-style': dataEndingStyle,
      ...otherProps
    } = props;

    const {
      state,
      shouldRender,
      onLayout,
      open,
      orientation,
      disabled,
      index,
      handleFocus,
      handleBlur,
    } = useAccordionPanel(props);

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...otherProps}
        ref={ref}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={evaluateStyles(style, state, {
          disableDefaultFocusRing,
          focusRingStyle,
        })}
        onLayout={onLayout}
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
        data-orientation={dataOrientation ?? orientation}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
        data-index={dataIndex ?? index}
        data-starting-style={dataStartingStyle}
        data-ending-style={dataEndingStyle}
      >
        {evaluate(children, state)}
      </View>
    );
  },
);

AccordionPanel.displayName = 'AccordionPanel';
