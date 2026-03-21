import { evaluateStyles } from '@base-ui-rn/core';
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
      style,
      tabIndex,
      ...otherProps
    } = props;

    const { state } = useTabsList();

    const resolvedChildren = evaluateStyles(children, state);
    const resolvedStyle = evaluateStyles(style, state);

    return (
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
        role='tablist'
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabsList.displayName = 'Tabs.List';
