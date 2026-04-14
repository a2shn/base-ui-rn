import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { TabsContext } from './context';
import type { TabsRootProps } from './types';
import { useTabs } from './use-tabs';

/**
 * Headless tabs root primitive built on top of React Native View.
 *
 * Groups the tabs and the corresponding panels. Provides the state and context
 * for all sub-components.
 *
 * @example
 * ```tsx
 * <Tabs.Root defaultValue="tab-1">
 * <Tabs.List>...</Tabs.List>
 * <Tabs.Panel value="tab-1">...</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */
export const TabsRoot = React.memo(
  React.forwardRef<View, TabsRootProps>((props, ref) => {
    const {
      activateOnFocus,
      children,
      defaultValue,
      onFocusChange,
      onValueChange,
      orientation,
      style,
      value,
      ...otherProps
    } = props;

    const { contextValue, state } = useTabs({
      activateOnFocus,
      defaultValue,
      onFocusChange,
      onValueChange,
      orientation,
      value,
    });

    const resolvedStyle = resolveValue(style, state);
    const mergedProps = mergeProps(
      { style: resolvedStyle },
      { ref },
      otherProps,
      { focusable: false },
    );

    return (
      <TabsContext.Provider value={contextValue}>
        <View {...mergedProps}>{resolveValue(children, state)}</View>
      </TabsContext.Provider>
    );
  }),
);

TabsRoot.displayName = 'Tabs.Root';
