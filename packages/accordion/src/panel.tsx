import * as React from 'react';
import { View } from 'react-native';
import type { AccordionPanelProps } from './types';
import { useAccordionPanel } from './use-accordion';

export const AccordionPanel = React.forwardRef<View, AccordionPanelProps>(
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
      'data-orientation': dataOrientation,
      'data-disabled': dataDisabled,
      'data-index': dataIndex,
      'data-starting-style': dataStartingStyle,
      'data-ending-style': dataEndingStyle,
      ...otherProps
    } = props;

    const { state, shouldRender, open, orientation, disabled, index } =
      useAccordionPanel(props);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    if (!shouldRender) {
      return null;
    }

    return (
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
        data-orientation={dataOrientation ?? orientation}
        data-disabled={dataDisabled ?? (disabled ? 'true' : undefined)}
        data-index={dataIndex ?? index}
        data-starting-style={dataStartingStyle}
        data-ending-style={dataEndingStyle}
      >
        {resolvedChildren}
      </View>
    );
  },
);

AccordionPanel.displayName = 'AccordionPanel';
