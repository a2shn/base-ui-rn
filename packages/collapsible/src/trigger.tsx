import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import type { CollapsibleTriggerProps } from './types';
import { useCollapsibleTrigger } from './use-collapsible';

/**
 * A button that opens and closes the collapsible panel.
 *
 * Supports keyboard activation, focus states, and accessibility attributes.
 * Must be used within a `Collapsible.Root`.
 *
 * @example
 * ```tsx
 * <Collapsible.Trigger>Toggle</Collapsible.Trigger>
 * ```
 */
export const CollapsibleTrigger = React.memo(
  React.forwardRef<View, CollapsibleTriggerProps>((props, ref) => {
    const { children, style, ...otherProps } = props;

    const {
      disabled,
      focused,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      open,
      state,
    } = useCollapsibleTrigger(otherProps);

    const internalRef = React.useRef<View>(null);
    React.useImperativeHandle(ref, () => internalRef.current!, []);

    const finalStyle = [
      evaluateStyles(style, state),
      Platform.select({
        web: open || focused ? { zIndex: 1 } : undefined,
      }),
    ];

    return (
      <PressableWithKeyPress
        accessibilityState={{
          disabled,
          expanded: open,
        }}
        accessible
        aria-disabled={disabled ? true : undefined}
        data-panel-open={open ? 'true' : undefined}
        disabled={disabled}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        onPress={handlePress}
        ref={internalRef}
        role='button'
        style={finalStyle}
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyPress>
    );
  }),
);

CollapsibleTrigger.displayName = 'CollapsibleTrigger';
