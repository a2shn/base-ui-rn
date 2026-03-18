import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles } from '@base-ui-rn/core';
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
      children,
      style,
      tabIndex,
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

    const { state } = useTabsIndicator();

    const resolvedChildren = evaluateStyles(children, state);
    const resolvedStyle = evaluateStyles(style, state);

    return (
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
        aria-hidden={ariaHidden ?? true}
        importantForAccessibility='no-hide-descendants'
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

TabsIndicator.displayName = 'Tabs.Indicator';
