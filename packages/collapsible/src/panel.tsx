import { evaluateStyles, mergeProps, useStyle } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { CollapsiblePanelProps } from './types';
import { useCollapsiblePanel } from './use-collapsible';

/**
 * A panel with the collapsible contents.
 *
 * Supports conditional rendering, dimension measurement variables, and
 * accessibility attributes. Must be used within a `Collapsible.Root`.
 *
 * @example
 * ```tsx
 * <Collapsible.Panel>
 * <Text>Panel content here</Text>
 * </Collapsible.Panel>
 * ```
 */
export const CollapsiblePanel = React.memo(
  React.forwardRef<View, CollapsiblePanelProps>((props, ref) => {
    const { children, style } = props;

    const { isDisabled, handleOnLayout, open, shouldRender, state } = useCollapsiblePanel(props);

    const resolvedStyle = useStyle({
      state,
      style,
    });

    const mergedProps = mergeProps(props, {
      onLayout: handleOnLayout,
      disabled: isDisabled,
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
    });

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
        {...mergedProps}
      >
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

CollapsiblePanel.displayName = 'Collapsible.Panel';
