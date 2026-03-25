import { evaluateStyles, PressableWithKeyPress } from '@base-ui-rn/core';
import * as React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

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
 *   <Switch.Thumb />
 * </Switch.Root>
 * ```
 */
export const SwitchRoot = React.memo(
  React.forwardRef<View, SwitchRootProps>((props, ref) => {
    const {
      'aria-busy': ariaBusy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      children,
      disableDefaultFocusRing,
      style,
      ...otherProps
    } = props;

    const {
      checked,
      disabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      readOnly,
      state,
    } = useSwitchRoot(props);

    const contextValue = React.useMemo(
      () => ({
        checked,
        disabled,
        focused: state.focused,
        focusVisible: state.focusVisible,
        readOnly,
      }),
      [checked, disabled, readOnly, state.focused, state.focusVisible],
    );

    const resolvedStyle = React.useMemo<StyleProp<ViewStyle>>(() => {
      const baseStyle = evaluateStyles(style, state);
      if (focusRingStyle) {
        return [baseStyle, focusRingStyle];
      }
      return baseStyle;
    }, [style, state, focusRingStyle]);

    return (
      <SwitchContext.Provider value={contextValue}>
        <PressableWithKeyPress
          {...otherProps}
          accessibilityState={{
            checked,
            disabled,
          }}
          accessible
          aria-busy={ariaBusy}
          aria-checked={checked}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={disabled}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-readonly={readOnly}
          data-checked={checked ? 'true' : undefined}
          data-disabled={disabled ? 'true' : undefined}
          disabled={disabled}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPress={handlePress}
          ref={ref}
          role='switch'
          style={resolvedStyle}
        >
          {evaluateStyles(children, state)}
        </PressableWithKeyPress>
      </SwitchContext.Provider>
    );
  }),
);

SwitchRoot.displayName = 'SwitchRoot';
