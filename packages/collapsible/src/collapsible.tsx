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
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-disabled': ariaDisabled,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      style,
      ...otherProps
    } = props;

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
      <CollapsibleContext.Provider value={contextValue}>
        <View
          {...otherProps}
          aria-busy={ariaBusy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={ariaDisabled ?? (disabled ? true : undefined)}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          data-disabled={disabled ? 'true' : undefined}
          data-open={open ? 'true' : undefined}
          ref={ref}
          style={evaluateStyles(style, state)}
        >
          {evaluateStyles(children, state)}
        </View>
      </CollapsibleContext.Provider>
    );
  }),
);

CollapsibleRoot.displayName = 'CollapsibleRoot';
