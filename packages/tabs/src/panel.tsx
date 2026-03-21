import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

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
      'data-activation-direction': dataActivationDirection,
      'data-hidden': dataHidden,
      'data-index': dataIndex,
      'data-orientation': dataOrientation,
      keepMounted,
      style,
      tabIndex,
      value,
      ...otherProps
    } = props;

    const { shouldRender, state } = useTabPanel({
      keepMounted,
      value,
    });

    if (!shouldRender) {
      return null;
    }

    const resolvedChildren = evaluateStyles(children, state);
    const resolvedStyle = evaluateStyles(style, state);

    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={ariaDisabled}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? (state.hidden ? true : undefined)}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
        data-hidden={dataHidden ?? (state.hidden ? 'true' : undefined)}
        data-index={dataIndex ?? state.index}
        data-orientation={dataOrientation ?? state.orientation}
        ref={ref}
        role='tabpanel'
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabPanel.displayName = 'Tabs.Panel';
