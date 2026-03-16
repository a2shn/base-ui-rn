import * as React from 'react';
import { View } from 'react-native';
import { evaluate } from '@base-ui-rn/core';
import type { TabPanelProps } from './types';
import { useTabPanel } from './use-tabs';

/**
 * A panel displayed when the corresponding tab is active.
 *
 * Supports conditional rendering and keepMounted logic.
 *
 * @example
 * ```tsx
 * <Tabs.Panel value="tab-1">
 *   <Text>Panel 1 content</Text>
 * </Tabs.Panel>
 * ```
 */
export const TabPanel = React.memo(
  React.forwardRef<View, TabPanelProps>((props, ref) => {
    const {
      children,
      value,
      keepMounted,
      style,
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
      'data-hidden': dataHidden,
      'data-orientation': dataOrientation,
      'data-activation-direction': dataActivationDirection,
      'data-index': dataIndex,
      ...otherProps
    } = props;

    const { state, shouldRender } = useTabPanel({
      value,
      keepMounted,
    });

    if (!shouldRender) {
      return null;
    }

    const resolvedChildren = evaluate(children, state);
    const resolvedStyle = evaluate(style, state);

    return (
      <View
        {...otherProps}
        ref={ref}
        style={resolvedStyle}
        role='tabpanel'
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? (state.hidden ? true : undefined)}
        aria-disabled={ariaDisabled}
        aria-keyshortcuts={ariaKeyshortcuts}
        data-hidden={dataHidden ?? (state.hidden ? 'true' : undefined)}
        data-orientation={dataOrientation ?? state.orientation}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
        data-index={dataIndex ?? state.index}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabPanel.displayName = 'Tabs.Panel';
