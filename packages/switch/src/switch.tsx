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
      'aria-readonly': ariaReadOnlyProp,
      children,
      id,
      style,
      ...otherProps
    } = props;

    const {
      checked,
      disabled: isDisabled,
      focusRingStyle,
      handleBlur,
      handleFocus,
      handleKeyDown,
      handlePress,
      readOnly: resolvedReadOnly,
      state,
      tabIndex,
    } = useSwitchRoot(props);

    const contextValue = React.useMemo(
      () => ({
        checked,
        disabled: isDisabled,
        focused: state.focused,
        readOnly: resolvedReadOnly,
      }),
      [checked, isDisabled, resolvedReadOnly, state.focused],
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
            disabled: isDisabled,
          }}
          accessible
          aria-busy={ariaBusy}
          aria-checked={checked}
          aria-describedby={ariaDescribedBy}
          aria-details={ariaDetails}
          aria-disabled={isDisabled}
          aria-hidden={ariaHidden}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-readonly={ariaReadOnlyProp ?? resolvedReadOnly}
          data-checked={checked ? 'true' : undefined}
          data-disabled={isDisabled ? 'true' : undefined}
          data-readonly={resolvedReadOnly ? 'true' : undefined}
          data-unchecked={!checked ? 'true' : undefined}
          disabled={isDisabled}
          nativeID={id}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onPress={handlePress}
          ref={ref}
          role='switch'
          style={resolvedStyle}
          tabIndex={tabIndex}
        >
          {evaluateStyles(children, state)}
        </PressableWithKeyPress>
      </SwitchContext.Provider>
    );
  }),
);

SwitchRoot.displayName = 'Switch.Root';
