import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabPanelProps } from './types';
import { useTabPanel } from './use-tab-panel';

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
    const { children, keepMounted, style, value, ...otherProps } = props;

    const { shouldRender, state } = useTabPanel({ keepMounted, value });

    const resolvedStyle = resolveValue(style, state);
    const mergedProps = mergeProps(
      { style: resolvedStyle },
      { ref },
      otherProps,
      {
        focusable: false,
        role: 'tabpanel',
      },
    );

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...mergedProps}
        accessibilityElementsHidden={state.hidden}
        importantForAccessibility={
          !state.hidden ? 'yes' : 'no-hide-descendants'
        }
      >
        {resolveValue(children, state)}
      </View>
    );
  }),
);

TabPanel.displayName = 'Tabs.Panel';
