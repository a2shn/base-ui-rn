import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabsListProps } from './types';
import { useTabsList } from './use-tabs';

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
    const {
      children,
      style,
      loopFocus,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      ...otherProps
    } = props;

    const { state } = useTabsList();

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

    return (
      <View role="tablist" {...mergedProps}>
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

TabsList.displayName = 'Tabs.List';
