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
      children,
      defaultValue,
      value,
      onValueChange,
      orientation,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const { state, contextValue } = useTabsRoot({
      defaultValue,
      value,
      onValueChange,
      orientation,
    });

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <TabsContext.Provider value={contextValue}>
        <View
          {...otherProps}
          ref={ref}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-orientation={state.orientation}
          data-activation-direction={state.activationDirection}
        >
          {resolvedChildren}
        </View>
      </TabsContext.Provider>
    );
  }),
);

TabsRoot.displayName = 'Tabs.Root';
