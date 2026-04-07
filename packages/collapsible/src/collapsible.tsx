import { mergeProps, resolveValue } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { CollapsibleContext } from './context';
import type { CollapsibleRootProps } from './types';
import { useCollapsible } from './use-collapsible';

/**
 * A collapsible panel controlled by a button.
 *
 * Manages the open/closed state and provides context to its Trigger and Panel
 * sub-components.
 *
 * @example
 * ```tsx
 * <Collapsible.Root>
 * <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 * <Collapsible.Panel>Content</Collapsible.Panel>
 * </Collapsible.Root>
 * ```
 */
export const CollapsibleRoot = React.memo(
  React.forwardRef<View, CollapsibleRootProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const { baseId, isDisabled, open, state, toggle } =
      useCollapsible(props);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        disabled: isDisabled,
        open,
        toggle,
      }),
      [baseId, isDisabled, open, toggle],
    );

    const resolvedStyle = resolveValue(style, state);

    const mergedProps = mergeProps(props, {
      focusable: false,
      ref,
      style: resolvedStyle,
      accessibilityState: {
        disabled: isDisabled,
        expanded: open,
      },
    });

    return (
      <CollapsibleContext.Provider value={contextValue}>
        <View {...mergedProps}>{resolveValue(children, state)}</View>
      </CollapsibleContext.Provider>
    );
  }),
);

CollapsibleRoot.displayName = 'Collapsible.Root';
