import { evaluateStyles } from '@base-ui-rn/core';
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
 *   <Text>Panel content here</Text>
 * </Collapsible.Panel>
 * ```
 */
export const CollapsiblePanel = React.memo(
  React.forwardRef<View, CollapsiblePanelProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      disabled,
      handleBlur,
      handleFocus,
      onLayout,
      open,
      shouldRender,
      state,
    } = useCollapsiblePanel(props);

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...otherProps}
        data-closed={!open ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onLayout={onLayout}
        ref={ref}
        style={evaluateStyles(style, state)}
      >
        {evaluateStyles(children, state)}
      </View>
    );
  }),
);

CollapsiblePanel.displayName = 'CollapsiblePanel';
