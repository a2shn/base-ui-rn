import { evaluateStyles } from '@base-ui-rn/core';
import * as React from 'react';
import { View } from 'react-native';

import { CollapsibleContext } from './context';
import type { CollapsibleRootProps } from './types';
import { useCollapsibleRoot } from './use-collapsible';

/**
 * A collapsible panel controlled by a button.
 *
 * Manages the open/closed state and provides context to its Trigger and Panel
 * sub-components.
 *
 * @example
 * ```tsx
 * <Collapsible.Root>
 *   <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 *   <Collapsible.Panel>Content</Collapsible.Panel>
 * </Collapsible.Root>
 * ```
 */
export const CollapsibleRoot = React.memo(
  React.forwardRef<View, CollapsibleRootProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const { baseId, disabled, open, state, toggle } =
      useCollapsibleRoot(otherProps);

    const contextValue = React.useMemo(
      () => ({
        baseId,
        disabled,
        open,
        toggle,
      }),
      [baseId, disabled, open, toggle],
    );

    return (
      <React.Fragment>
        <CollapsibleContext.Provider value={contextValue}>
          <View ref={ref} style={evaluateStyles(style, state)}>
            {evaluateStyles(children, state)}
          </View>
        </CollapsibleContext.Provider>
      </React.Fragment>
    );
  }),
);

CollapsibleRoot.displayName = 'CollapsibleRoot';
