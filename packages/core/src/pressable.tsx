import * as React from 'react';
import {
  Pressable,
  View,
  type PressableProps,
  type NativeSyntheticEvent,
} from 'react-native';
import type {
  KeyPressEventData,
  ARIABaseProps,
  ARIAFocusProps,
  ARIALiveProps,
  ARIATraitDisabled,
  ARIATraitExpanded,
} from './types';

/**
 * A Pressable component with additional props for web accessibility and keyboard events.
 * This is a temporary utility until React Native officially supports these props on all platforms.
 */
export const PressableWithKeyPress =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps &
      ARIABaseProps &
      ARIAFocusProps &
      ARIALiveProps &
      ARIATraitDisabled &
      ARIATraitExpanded & {
        onKeyPress?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
        onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;
