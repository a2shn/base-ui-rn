import * as React from 'react';
import { View } from 'react-native';
import type { TabPanelProps } from './types';
import { useTabPanel } from './use-tabs';

/**
 * A panel displayed when the corresponding tab is active.
 *
 * Supports conditional rendering and keepMounted logic.
 *
 * @example
 * ```tsx
 * <Tabs.Panel value="tab-1">
 *   <Text>Panel 1 content</Text>
 * </Tabs.Panel>
 * ```
 */
export const TabPanel = React.memo(
  React.forwardRef<View, TabPanelProps>((props, ref) => {
    const {
      children,
      value,
      keepMounted,
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

    const { state, shouldRender } = useTabPanel({
      value,
      keepMounted,
    });

    if (!shouldRender) {
      return null;
    }

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    return (
      <View
        {...otherProps}
        ref={ref}
        role="tabpanel"
        tabIndex={tabIndex}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-expanded={ariaExpanded}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden ?? (state.hidden ? true : undefined)}
        data-hidden={state.hidden ? 'true' : undefined}
        data-orientation={state.orientation}
        data-activation-direction={state.activationDirection}
        data-index={state.index}
      >
        {resolvedChildren}
      </View>
    );
  }),
);

TabPanel.displayName = 'Tabs.Panel';
