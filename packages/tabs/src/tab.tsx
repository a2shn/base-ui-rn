import * as React from 'react';
import { View, type NativeSyntheticEvent } from 'react-native';
import {
  evaluateStyles,
  type KeyPressEventData,
  PressableWithKeyPress,
} from '@base-ui-rn/core';
import type { TabProps } from './types';
import { useTab } from './use-tabs';

/**
 * An individual interactive tab button that toggles the corresponding panel.
 *
 * Supports keyboard activation, focus states, and ARIA attributes for web.
 *
 * @example
 * ```tsx
 * <Tabs.Tab value="tab-1">
 *   {({ active }) => <Text style={{ color: active ? 'blue' : 'black' }}>Tab 1</Text>}
 * </Tabs.Tab>
 * ```
 */
export const Tab = React.memo(
  React.forwardRef<View, TabProps>((props, forwardedRef) => {
    const {
      children,
      value,
      disabled,
      style,
      disableDefaultFocusRing = false,
      focusRingStyle,
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
      'aria-keyshortcuts': ariaKeyshortcuts,
      'aria-expanded': ariaExpanded,
      'data-active': dataActive,
      'data-disabled': dataDisabled,
      'data-orientation': dataOrientation,
      'data-activation-direction': dataActivationDirection,
      ...otherProps
    } = props;

    const {
      ref,
      state,
      handlePress,
      handleKeyDown,
      handleFocus,
      handleBlur,
      onLayout,
    } = useTab({
      value,
      disabled,
    });

    React.useImperativeHandle(forwardedRef, () => ref.current!);

    return (
      <PressableWithKeyPress
        {...otherProps}
        ref={ref}
        disabled={state.disabled}
        onPress={handlePress}
        onKeyDown={(e: unknown) =>
          handleKeyDown(e as NativeSyntheticEvent<KeyPressEventData>)
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onLayout={onLayout}
        style={() =>
          evaluateStyles(style, state, {
            disableDefaultFocusRing,
            focusRingStyle,
          })
        }
        accessible
        role='tab'
        aria-selected={state.active}
        aria-disabled={state.disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-details={ariaDetails}
        aria-busy={ariaBusy}
        aria-hidden={ariaHidden}
        aria-keyshortcuts={ariaKeyshortcuts}
        aria-expanded={ariaExpanded}
        tabIndex={tabIndex}
        data-active={dataActive ?? (state.active ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (state.disabled ? 'true' : undefined)}
        data-orientation={dataOrientation ?? state.orientation}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
      >
        {evaluateStyles(children, state)}
      </PressableWithKeyPress>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
