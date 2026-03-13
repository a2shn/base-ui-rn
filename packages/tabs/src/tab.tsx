import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
} from 'react-native';
import {
  DEFAULT_FOCUS_RING_STYLE,
  type KeyPressEventData,
} from '@base-ui-rn/core';
import type { TabProps } from './types';
import { useTab } from './use-tabs';

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
    } & React.RefAttributes<View>
  >;

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
      tabIndex,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      'aria-describedby': ariaDescribedBy,
      'aria-details': ariaDetails,
      'aria-busy': ariaBusy,
      'aria-hidden': ariaHidden,
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
      handleKeyPress,
      handleFocus,
      handleBlur,
      onLayout,
    } = useTab({
      value,
      disabled,
    });

    React.useImperativeHandle(forwardedRef, () => ref.current!);

    const resolvedStyle = typeof style === 'function' ? style(state) : style;
    const resolvedChildren =
      typeof children === 'function' ? children(state) : children;

    const finalStyle = [
      resolvedStyle,
      !disableDefaultFocusRing &&
        state.focusVisible &&
        DEFAULT_FOCUS_RING_STYLE,
    ];

    return (
      <PressableWithKeyPress
        {...otherProps}
        ref={ref}
        disabled={state.disabled}
        onPress={handlePress}
        onKeyPress={(e: unknown) =>
          handleKeyPress(e as NativeSyntheticEvent<KeyPressEventData>)
        }
        onKeyDown={(e: unknown) =>
          handleKeyPress(e as NativeSyntheticEvent<KeyPressEventData>)
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        onLayout={onLayout}
        style={finalStyle}
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
        tabIndex={tabIndex}
        data-active={dataActive ?? (state.active ? 'true' : undefined)}
        data-disabled={dataDisabled ?? (state.disabled ? 'true' : undefined)}
        data-orientation={dataOrientation ?? state.orientation}
        data-activation-direction={
          dataActivationDirection ?? state.activationDirection
        }
      >
        {resolvedChildren}
      </PressableWithKeyPress>
    );
  }),
);

Tab.displayName = 'Tabs.Tab';
