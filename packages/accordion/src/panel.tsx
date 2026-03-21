import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

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
export const AccordionPanel = React.memo(
  React.forwardRef<View, AccordionPanelProps>((props, ref) => {
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
      'data-ending-style': dataEndingStyle,
      'data-index': dataIndex,
      'data-open': dataOpen,
      'data-orientation': dataOrientation,
      'data-starting-style': dataStartingStyle,
      style,
      ...otherProps
    } = props;

    const {
      disabled,
      index,
      onLayout,
      open,
      orientation,
      shouldRender,
      state,
    } = useAccordionPanel(props);

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...otherProps}
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
        data-ending-style={dataEndingStyle}
        data-index={dataIndex ?? index}
        data-open={dataOpen ?? (open ? 'true' : undefined)}
        data-orientation={dataOrientation ?? orientation}
        data-starting-style={dataStartingStyle}
        onLayout={onLayout}
        ref={ref}
        style={evaluateStyles(style, state)}
      >
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

AccordionPanel.displayName = 'AccordionPanel';
