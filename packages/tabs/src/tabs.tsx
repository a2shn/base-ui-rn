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
      activateOnFocus,
      onFocusChange,
      tabIndex,
      style,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'data-orientation': dataOrientation,
      'data-activation-direction': dataActivationDirection,
      ...otherProps
    } = props;

    const { state, contextValue } = useTabsRoot({
      defaultValue,
      value,
      onValueChange,
      orientation,
      activateOnFocus,
      onFocusChange,
    });

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <TabsContext.Provider value={contextValue}>
        <View
          {...otherProps}
          ref={ref}
          style={resolvedStyle}
          tabIndex={tabIndex}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-expanded={ariaExpanded}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          data-orientation={dataOrientation ?? state.orientation}
          data-activation-direction={
            dataActivationDirection ?? state.activationDirection
          }
        >
          {resolvedChildren}
        </View>
      </TabsContext.Provider>
    );
  }),
);

TabsRoot.displayName = 'Tabs.Root';
