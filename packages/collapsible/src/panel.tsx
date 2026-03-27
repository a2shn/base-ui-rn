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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      style,
      ...otherProps
    } = props;

    const { disabled, onLayout, open, shouldRender, state } =
      useCollapsiblePanel(props);

    if (!shouldRender) {
      return null;
    }

    return (
      <View
        {...otherProps}
        aria-busy={ariaBusy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
        aria-hidden={ariaHidden ?? (!open ? true : undefined)}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        data-closed={!open ? 'true' : undefined}
        data-disabled={disabled ? 'true' : undefined}
        data-open={open ? 'true' : undefined}
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
