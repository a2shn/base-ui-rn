import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { TabsIndicatorProps } from './types';
import { useTabsIndicator } from './use-tabs';

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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-expanded': ariaExpanded,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      'data-activation-direction': dataActivationDirection,
      'data-orientation': dataOrientation,
      style,
      tabIndex,
      ...otherProps
    } = props;

    const { state } = useTabsIndicator();

    const resolvedChildren = evaluateStyles(children, state);
    const resolvedStyle = evaluateStyles(style, state);

    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-hidden={ariaHidden ?? true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
        data-orientation={dataOrientation ?? state.orientation}
        importantForAccessibility='no-hide-descendants'
        ref={ref}
        style={resolvedStyle}
        tabIndex={tabIndex}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabsIndicator.displayName = 'Tabs.Indicator';
