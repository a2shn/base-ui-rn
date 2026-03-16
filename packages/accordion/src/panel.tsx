import * as React from 'react';
import { View } from 'react-native';
import { evaluate } from '@base-ui-rn/core';
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
    } = useAccordionPanel(props);

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...otherProps}
        ref={ref}
        style={evaluate(style, state)}
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
