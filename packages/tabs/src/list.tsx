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
 *   <Tabs.Tab value="tab-1">Tab 1</Tabs.Tab>
 *   <Tabs.Tab value="tab-2">Tab 2</Tabs.Tab>
 * </Tabs.List>
 * ```
 */
export const TabsList = React.memo(
  React.forwardRef<View, TabsListProps>((props, ref) => {
    const {
      children,
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

    const { state } = useTabsList();

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;
    const resolvedStyle = typeof style === 'function' ? style(state) : style;

    return (
      <View
        {...otherProps}
        ref={ref}
        style={resolvedStyle}
        role='tablist'
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
    );
  }),
);

TabsList.displayName = 'Tabs.List';
