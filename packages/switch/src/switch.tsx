import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
} from 'react-native';
import { DEFAULT_FOCUS_RING_STYLE } from '@base-ui-rn/core';
import type { KeyPressEventData } from './types';
import type { SwitchRootProps } from './types';
import { SwitchContext } from './context';
import { useSwitchRoot } from './use-switch';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
    } & React.RefAttributes<View>
  >;

/**
 * The main container for the Switch component.
 *
 * Manages the checked state and handles user interactions (press, keyboard).
 * Provides context to the `Switch.Thumb` sub-component.
 *
 * @example
 * ```tsx
 * <Switch.Root>
 *   <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchRoot = React.forwardRef<View, SwitchRootProps>(
  (props, ref) => {
    const {
      children,
      style,
      disableDefaultFocusRing = false,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      ...otherProps
    } = props;

    const {
      state,
      checked,
      disabled,
      readOnly,
      handlePress,
      handleKeyPress,
      handleFocus,
      handleBlur,
    } = useSwitchRoot(props);

    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      style,
      !disableDefaultFocusRing &&
        state.focusVisible &&
        DEFAULT_FOCUS_RING_STYLE,
    ];

    const contextValue = React.useMemo(
      () => ({
        checked,
        disabled,
        readOnly,
        focused: state.focused,
        focusVisible: state.focusVisible,
      }),
      [checked, disabled, readOnly, state.focused, state.focusVisible],
    );

    return (
      <SwitchContext.Provider value={contextValue}>
        <PressableWithKeyPress
          {...otherProps}
          ref={ref}
          disabled={disabled}
          onPress={handlePress}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={finalStyle}
          accessible
          role='switch'
          aria-checked={checked}
          aria-disabled={disabled}
          aria-readonly={readOnly}
          aria-labelledby={ariaLabelledBy}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-busy={ariaBusy}
          aria-hidden={ariaHidden}
          accessibilityState={{
            checked,
            disabled,
          }}
          data-checked={checked ? 'true' : undefined}
          data-disabled={disabled ? 'true' : undefined}
        >
          {resolvedChildren}
        </PressableWithKeyPress>
      </SwitchContext.Provider>
    );
  },
);

SwitchRoot.displayName = 'SwitchRoot';
