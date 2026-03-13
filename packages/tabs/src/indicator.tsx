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
      children,
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

    const { state } = useTabsIndicator();

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
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
        aria-hidden={ariaHidden ?? true}
        importantForAccessibility="no-hide-descendants"
        data-orientation={state.orientation}
        data-activation-direction={state.activationDirection}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabsIndicator.displayName = 'Tabs.Indicator';
