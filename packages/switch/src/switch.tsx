import {
  evaluateStyles,
  mergeProps,
  mergeRefs,
  PressableWithKeyDown,
  useStyle,
} from '@base-ui-rn/core';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { SwitchContext } from './context';
import type { SwitchRootProps } from './types';
import { useSwitchRoot } from './use-switch';

/**
 * The main container for the Switch component.
 *
 * Manages the checked state and handles user interactions (press, keyboard).
 * Provides context to the `Switch.Thumb` sub-component.
 *
 * @example
 * ```tsx
 * <Switch.Root>
 * <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchRoot = React.memo(
  React.forwardRef<View, SwitchRootProps>((props, ref) => {
    const {
      children,
      id,
      style,
      onPress,
      disableDefaultFocusRing,
      focusableWhenDisabled,
      ...restProps
    } = props;

    const {
      checked,
      isDisabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      handleAccessibilityAction,
      state,
      isFocusable,
      tabIndex,
    } = useSwitchRoot(props);

    const internalRef = React.useRef<View>(null);
    const mergedRef = mergeRefs(internalRef, ref);

    const resolvedStyle = useStyle({
      additionalStyles: [
        focusRingStyle,
        Platform.OS === 'web' && state.focused ? { zIndex: 1 } : undefined,
      ],
      state,
      style,
    });

    const mergedProps = mergeProps(restProps, {
      handlers: {
        onBlur: handleBlur,
        onFocus: handleFocus,
        onKeyDown: handleKeyDown,
        onPress: handlePress,
        onAccessibilityAction: handleAccessibilityAction,
      },
      disabled: isDisabled,
      focusable: isFocusable,
      ref: mergedRef,
      style: resolvedStyle,
      accessibilityState: {
        checked,
        disabled: isDisabled,
      },
    });

    return (
      <SwitchContext.Provider value={state}>
        <PressableWithKeyDown
          accessible
          nativeID={id}
          role="switch"
          tabIndex={tabIndex}
          {...mergedProps}
        >
          {evaluateStyles(children, state)}
        </PressableWithKeyDown>
      </SwitchContext.Provider>
    );
  }),
);

SwitchRoot.displayName = 'Switch.Root';
