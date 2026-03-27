import { evaluateStyles } from '@base-ui-rn/core';
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
 *   <Tabs.List>...</Tabs.List>
 *   <Tabs.Panel value="tab-1">...</Tabs.Panel>
 * </Tabs.Root>
 * ```
 */
export const TabsRoot = React.memo(
  React.forwardRef<View, TabsRootProps>((props, ref) => {
    const {
      activateOnFocus,
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
      'data-orientation': dataOrientation,
      defaultValue,
      onFocusChange,
      onValueChange,
      orientation,
      style,
      value,
      ...otherProps
    } = props;

    const { contextValue, state } = useTabsRoot({
      activateOnFocus,
      defaultValue,
      onFocusChange,
      onValueChange,
      orientation,
      value,
    });

    const resolvedChildren = evaluateStyles(children, state);
    const resolvedStyle = evaluateStyles(style, state);

    return (
      <TabsContext.Provider value={contextValue}>
        <View
          {...otherProps}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={ariaDisabled}
          aria-expanded={ariaExpanded}
          aria-hidden={ariaHidden}
          aria-keyshortcuts={ariaKeyshortcuts}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-activation-direction={
            dataActivationDirection ?? state.activationDirection
          }
          data-orientation={dataOrientation ?? state.orientation}
          ref={ref}
          style={resolvedStyle}
        >
          {resolvedChildren}
        </View>
      </TabsContext.Provider>
    );
  }),
);

TabsRoot.displayName = 'Tabs.Root';
