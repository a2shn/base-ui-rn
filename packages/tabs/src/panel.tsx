import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
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
 * <Text>Panel 1 content</Text>
 * </Tabs.Panel>
 * ```
 */
export const TabPanel = React.memo(
  React.forwardRef<View, TabPanelProps>((props, ref) => {
    const {
      children,
      keepMounted,
      style,
      value,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      ...otherProps
    } = props;

    const { shouldRender, state } = useTabPanel({ keepMounted, value });

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(otherProps, {
      handlers: {},
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        accessibilityElementsHidden={state.hidden}
        importantForAccessibility={!state.hidden ? 'yes' : 'no-hide-descendants'}
        role="tabpanel"
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

TabPanel.displayName = 'Tabs.Panel';
