import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { TabsContext } from './context';
import type { TabsRootProps } from './types';
import { useTabsRoot } from './use-tabs';

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
    } = props;

    const { contextValue, state } = useTabsRoot({
      activateOnFocus,
      defaultValue,
      onFocusChange,
      onValueChange,
      orientation,
      value,
    });

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
      <TabsContext.Provider value={contextValue}>
        <View {...mergedProps}>
          {evaluateStyles(children, state)}
        </View>
      </TabsContext.Provider>
    );
  }),
);

TabsRoot.displayName = 'Tabs.Root';
