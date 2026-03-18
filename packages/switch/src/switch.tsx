import * as React from 'react';
import { View } from 'react-native';
import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import type { SwitchRootProps } from './types';
import { SwitchContext } from './context';
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
      focusRingStyle,
      'aria-label': ariaLabel,
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
      handleKeyDown,
      handleFocus,
      handleBlur,
    } = useSwitchRoot(props);

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
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={() =>
            evaluateStyles(style, state, {
              disableDefaultFocusRing,
              focusRingStyle,
            })
          }
          accessible
          role='switch'
          aria-checked={checked}
          aria-disabled={disabled}
          aria-readonly={readOnly}
          aria-label={ariaLabel}
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
          {evaluateStyles(children, state)}
        </PressableWithKeyPress>
      </SwitchContext.Provider>
    );
  },
);

SwitchRoot.displayName = 'SwitchRoot';
