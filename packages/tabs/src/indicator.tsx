import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabsIndicatorProps } from './types';
import { useTabsIndicator } from './use-tabs-indicator';

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
    const { children, style, ...otherProps } = props;

    const { state } = useTabsIndicator();

    const resolvedStyle = resolveValue(style, state);
    const mergedProps = mergeProps(otherProps, {
      focusable: false,
      ref,
      style: resolvedStyle,
      importantForAccessibility: 'no-hide-descendants',
    });

    return <View {...mergedProps}>{resolveValue(children, state)}</View>;
  }),
);

TabsIndicator.displayName = 'Tabs.Indicator';
