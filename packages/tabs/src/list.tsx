import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabsListProps } from './types';
import { useTabsList } from './use-tabs-list';

/**
 * Groups the individual tab buttons.
 *
 * Provides orientation and activation direction data to its children.
 *
 * @example
 * ```tsx
 * <Tabs.List>
 * <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
 * <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
 * </Tabs.List>
 * ```
 */
export const TabsList = React.memo(
  React.forwardRef<View, TabsListProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const { state } = useTabsList();

    const resolvedStyle = resolveValue(style, state);
    const mergedProps = mergeProps(
    { style: resolvedStyle },
    { ref },
    otherProps,
    {
      focusable: false,
      role: "tablist"
    }
  );

    return <View {...mergedProps}>{resolveValue(children, state)}</View>;
  }),
);

TabsList.displayName = 'Tabs.List';
