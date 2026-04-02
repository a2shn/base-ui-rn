import * as React from 'react';
import {
  type NativeSyntheticEvent,
  Pressable,
  type PressableProps,
  View,
} from 'react-native';

import { KeyDownEventData } from './types';

export const PressableWithKeyDown =
  Pressable as unknown as React.ForwardRefExoticComponent<
    PressableProps & {
      onKeyDown?: (e: NativeSyntheticEvent<KeyDownEventData>) => void;
    } & React.RefAttributes<View>
  >;
