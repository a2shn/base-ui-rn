import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import type { CollapsiblePanelProps } from './types';
import { useCollapsiblePanel } from './use-collapsible-panel';

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
    const { children, style, ...otherProps } = props;

    const { handleOnLayout, open, shouldRender, state } =
      useCollapsiblePanel(props);

    const resolvedStyle = resolveValue(style, state);
    const mergedProps = mergeProps(
      {
        accessibilityState: { expanded: open },
        onLayout: handleOnLayout,
        style: resolvedStyle,
      },
      { ref },
      otherProps,
      { focusable: false },
    );

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...mergedProps}
        accessibilityElementsHidden={!open}
        importantForAccessibility={open ? 'yes' : 'no-hide-descendants'}
      >
        {resolveValue(children, state)}
      </View>
    );
  }),
);

CollapsiblePanel.displayName = 'Collapsible.Panel';
