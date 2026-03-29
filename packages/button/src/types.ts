import { KeyPressEventData } from '@base-ui-rn/core';
import { FocusRingState } from '@base-ui-rn/focus-ring';
import {
  NativeSyntheticEvent,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';

/**
 * Represents the interactive state of the Button.
 */
export interface ButtonState extends FocusRingState {
  /**
   * Whether the button is currently being pressed.
   * @default false
   */
  pressed: boolean;
}

/**
 * Props for a headless Button component.
 *
 * This component provides behavior and accessibility without enforcing styles.
 */
export interface ButtonProps extends Omit<
  PressableProps,
  'children' | 'style'
> {
  /**
   * The content of the button.
   *
   * Can be a React node or a render function receiving the current button state.
   *
   * @example
   * ```tsx
   * <Button>
   *   {({ pressed }) => <Text>{pressed ? 'Pressed' : 'Press me'}</Text>}
   * </Button>
   * ```
   */
  children?: React.ReactNode | ((state: ButtonState) => React.ReactNode);

  /**
   * Style applied to the button.
   *
   * Can be a static style or a function based on the button state.
   *
   * @example
   * ```tsx
   * style={({ pressed }) => ({
   *   opacity: pressed ? 0.5 : 1
   * })}
   * ```
   */
  style?: StyleProp<ViewStyle> | ((state: ButtonState) => StyleProp<ViewStyle>);

  /**
   * Whether the button is disabled.
   *
   * Disabled buttons do not respond to press or keyboard events.
   *
   * @default false
   */
  disabled?: boolean;

  /**
   * Whether the button remains focusable when disabled.
   *
   * Useful for accessibility when you still want screen readers
   * to reach the element.
   *
   * @default false
   */
  focusableWhenDisabled?: boolean;

  /**
   * Disables the default focus ring behavior.
   *
   * Use this if you want to provide a custom focus indication.
   *
   * @default false
   */
  disableDefaultFocusRing?: boolean;

  /**
   * Handler for key down events.
   */
  onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
}

export type { KeyPressEventData };
