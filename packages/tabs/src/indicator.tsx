import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabsIndicatorProps } from './types';
import { useTabsIndicator } from './use-tabs';

/**
 * A visual indicator that can be styled to match the position of the currently active tab.
 *
 * @example
 * ```tsx
 * <Tabs.Indicator style={{ height: 2, backgroundColor: 'blue', position: 'absolute', bottom: 0 }} />
 * ```
 */
export const TabsIndicator = React.memo(
  React.forwardRef<View, TabsIndicatorProps>((props, ref) => {
    const {
      children,
      style,
    } = props;

    const { state } = useTabsIndicator();

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      disabled: false,
      focusable: false,
      ref,
      style: resolvedStyle,
    });

    return (
      <View importantForAccessibility="no-hide-descendants" {...mergedProps}>
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

TabsIndicator.displayName = 'Tabs.Indicator';
