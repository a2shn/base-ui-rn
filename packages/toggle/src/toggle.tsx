import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  type View,
  type NativeSyntheticEvent,
  type GestureResponderEvent,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
} from 'react-native';

/**
 * Default hit slop applied to the toggle.
 *
 * @default
 * { top: 14, bottom: 14, left: 14, right: 14 }
 */
const DEFAULT_HIT_SLOP = { top: 14, bottom: 14, left: 14, right: 14 };

type KeyPressEventData = { key: string };

type WebToggleProps = {
  tabIndex?: 0 | -1;
  'aria-disabled'?: boolean;
  /**
   * Reflects pressed state for the ARIA button-toggle pattern on web.
   * Automatically set when the toggle uses role="button".
   */
  'aria-pressed'?: boolean;
  /**
   * Custom data attribute applied on web for CSS selectors and testing.
   * Reflects the current pressed state as a boolean string.
   *
   * @example
   * [data-pressed="true"] { background: blue; }
   */
  'data-pressed'?: boolean;
};

const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      WebToggleProps & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;

/**
 * Details passed as the second argument to `onPressedChange`.
 * Describes how the toggle was activated.
 */
export interface TogglePressedChangeDetails {
  /**
   * How the toggle was activated.
   *
   * - `'press'`               — touch or mouse press
   * - `'keyboard'`            — hardware keyboard key (Enter / Space / Select / OK …)
   * - `'accessibilityAction'` — screen reader action (activate / click / magicTap)
   */
  source: 'press' | 'keyboard' | 'accessibilityAction';
}

/**
 * Props for `Toggle.Root`.
 */
export interface ToggleProps extends Omit<PressableProps, 'role'> {
  /**
   * Controlled pressed state.
   */
  pressed?: boolean;

  /**
   * Uncontrolled initial pressed state.
   *
   * @default false
   */
  defaultPressed?: boolean;

  /**
   * Called when the pressed state changes.
   *
   * @param pressed  The next pressed state.
   * @param details  Source details describing how the toggle was activated.
   */
  onPressedChange?: (
    pressed: boolean,
    details: TogglePressedChangeDetails,
  ) => void;

  /**
   * Accessibility role exposed to assistive technologies.
   *
   * @default 'checkbox'
   */
  role?: 'checkbox' | 'switch';

  /**
   * Describes the result of toggling the control.
   *
   * @default 'Toggles the state'
   */
  accessibilityHint?: string;

  /**
   * Keeps the toggle focusable even when disabled.
   *
   * Useful for loading states where focus should not jump away.
   * The toggle remains in the tab/focus order and screen readers can still
   * announce it as disabled, but all activation is blocked.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Called when a hardware keyboard key is pressed while the toggle is focused.
   *
   * Fired for every key — including non-activation keys — so you can handle
   * custom navigation or analytics. Activation keys that change pressed state
   * are processed before this callback fires.
   */
  onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;

  /**
   * Expands the interactive touch area beyond the visual bounds.
   *
   * @default
   * { top: 14, bottom: 14, left: 14, right: 14 }
   */
  hitSlop?: PressableProps['hitSlop'];
}

/**
 * Headless toggle primitive built on top of React Native `Pressable`.
 *
 * Supports a primary `pressed` / `onPressedChange` API.
 *
 * @example
 * ```tsx
 * // Uncontrolled
 * <Toggle
 *   defaultPressed={false}
 *   onPressedChange={(pressed, { source }) => console.log(pressed, source)}
 *   accessibilityHint="Enables dark mode"
 * >
 *   {({ pressed }) => <View style={{ opacity: pressed ? 0.6 : 1 }} />}
 * </Toggle>
 *
 * // Controlled
 * <Toggle
 *   pressed={enabled}
 *   onPressedChange={({ pressed }) => setEnabled(pressed)}
 *   accessibilityHint="Enables dark mode"
 * >
 *   <Text>Toggle</Text>
 * </Toggle>
 * ```
 */
export const Toggle = React.memo(
  React.forwardRef<View, ToggleProps>(function Root(
    {
      pressed: controlledPressed,
      defaultPressed = false,
      onPressedChange,
      role = 'checkbox',
      disabled,
      onPress,
      onKeyPress,
      accessibilityHint = 'Toggles the state',
      accessibilityState,
      accessibilityActions,
      onAccessibilityAction,
      accessibilityRole,
      focusableWhenDisabled = false,
      hitSlop = DEFAULT_HIT_SLOP,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const isDisabled = disabled === true;
    const isFocusable = !isDisabled || focusableWhenDisabled === true;

    const controlledState = controlledPressed;

    const [uncontrolledState, setUncontrolledState] =
      React.useState(defaultPressed);

    const isPressed =
      controlledState !== undefined ? controlledState : uncontrolledState;

    // Fires both the new and legacy callbacks so consumers can use either.

    const dispatchChange = React.useCallback(
      (next: boolean, details: TogglePressedChangeDetails) => {
        if (controlledState === undefined) {
          setUncontrolledState(next);
        }
        onPressedChange?.(next, details);
      },
      [controlledState, onPressedChange],
    );

    const activateToggle = React.useCallback(
      (
        source: TogglePressedChangeDetails['source'],
        nativeEvent: GestureResponderEvent | null = null,
      ) => {
        dispatchChange(!isPressed, { source });
        if (nativeEvent !== null && source === 'press') {
          onPress?.(nativeEvent);
        }
      },
      [isPressed, dispatchChange, onPress],
    );

    const handlePress = React.useCallback(
      (event: GestureResponderEvent) => {
        activateToggle('press', event);
      },
      [activateToggle],
    );

    const handleKeyPress = React.useCallback(
      (e: NativeSyntheticEvent<KeyPressEventData>) => {
        const key = e.nativeEvent.key;

        const isActivationKey =
          key === 'Enter' ||
          key === ' ' ||
          key === 'Spacebar' ||
          key === 'Space' ||
          key === 'Select' ||
          key === 'Return' ||
          key === 'OK' ||
          key === 'Accept';

        if (isActivationKey) {
          activateToggle('keyboard');
        }

        onKeyPress?.(e);
      },
      [activateToggle, onKeyPress],
    );

    const handleAccessibilityAction = React.useCallback(
      (event: AccessibilityActionEvent) => {
        const { actionName } = event.nativeEvent;

        if (
          actionName === 'activate' ||
          actionName === 'click' ||
          actionName === 'magicTap'
        ) {
          activateToggle('accessibilityAction');
        }

        onAccessibilityAction?.(event);
      },
      [activateToggle, onAccessibilityAction],
    );

    const mergedAccessibilityState = React.useMemo(
      () => ({
        ...accessibilityState,
        disabled: isDisabled,
        checked: isPressed,
      }),
      [accessibilityState, isDisabled, isPressed],
    );

    const mergedAccessibilityActions = React.useMemo<
      ReadonlyArray<AccessibilityActionInfo>
    >(() => {
      const actions = accessibilityActions ?? [];
      const hasActivate = actions.some((a) => a.name === 'activate');
      return hasActivate ? actions : [...actions, { name: 'activate' }];
    }, [accessibilityActions]);

    const resolvedTabIndex =
      (props as WebToggleProps).tabIndex ?? (isFocusable ? 0 : -1);

    const resolvedAriaDisabled =
      (props as WebToggleProps)['aria-disabled'] ?? isDisabled;

    // aria-pressed is relevant when the consumer overrides role to 'button'.
    // For checkbox / switch roles, accessibilityState.checked maps to aria-checked.
    const resolvedAriaPressed =
      (props as WebToggleProps)['aria-pressed'] ?? isPressed;

    // data-pressed enables CSS selectors such as [data-pressed="true"] { … }
    const resolvedDataPressed =
      (props as WebToggleProps)['data-pressed'] ?? isPressed;

    return (
      <PressableWithKeyPress
        {...props}
        ref={forwardedRef}
        disabled={isDisabled}
        accessible
        accessibilityRole={accessibilityRole ?? role}
        accessibilityHint={accessibilityHint}
        accessibilityState={mergedAccessibilityState}
        accessibilityActions={mergedAccessibilityActions}
        onAccessibilityAction={handleAccessibilityAction}
        focusable={isFocusable}
        tabIndex={resolvedTabIndex}
        aria-disabled={resolvedAriaDisabled}
        aria-pressed={resolvedAriaPressed}
        data-pressed={resolvedDataPressed}
        importantForAccessibility='yes'
        hitSlop={hitSlop}
        onPress={handlePress}
        onKeyPress={handleKeyPress}
      >
        {children}
      </PressableWithKeyPress>
    );
  }),
);
