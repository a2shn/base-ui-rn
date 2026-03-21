import * as React from 'react';
import {
  type NativeSyntheticEvent,
  Pressable,
  type PressableProps,
  View,
} from 'react-native';

import type {
  ARIABaseProps,
  ARIAFocusProps,
  ARIALiveProps,
  ARIATraitDisabled,
  ARIATraitExpanded,
  KeyPressEventData,
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
        onKeyDown?: (e: NativeSyntheticEvent<KeyPressEventData>) => void;
      } & React.RefAttributes<View>
  >;
