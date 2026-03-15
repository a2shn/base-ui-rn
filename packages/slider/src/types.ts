import type * as React from 'react';
import type {
  GestureResponderEvent,
  TextProps,
  ViewProps,
  ViewStyle,
  NativeSyntheticEvent,
} from 'react-native';
import type {
  KeyPressEventData,
  WebAccessibilityProps,
} from '@base-ui-rn/core';

export type SliderValue = number | number[];

export interface SliderState {
  value: number[];
  min: number;
  max: number;
  step: number;
  disabled: boolean;
  orientation: 'horizontal' | 'vertical';
}

export interface SliderRootProps
  extends Omit<ViewProps, 'children' | 'style'>, WebAccessibilityProps {
  value?: SliderValue;
  defaultValue?: SliderValue;
  onValueChange?: (value: SliderValue) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
  children?: React.ReactNode | ((state: SliderState) => React.ReactNode);
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

export interface SliderPartProps
  extends Omit<ViewProps, 'children' | 'style'>, WebAccessibilityProps {
  children?: React.ReactNode;
  style?: ViewStyle | ((state: SliderState) => ViewStyle | undefined);
}

export interface SliderThumbState extends SliderState {
  index: number;
  valueNow: number;
}

export interface SliderThumbProps
  extends
    Omit<ViewProps, 'style' | 'disabled' | 'onKeyPress'>,
    WebAccessibilityProps {
  index?: number;
  'aria-label'?: string;
  accessibilityHint?: string;
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  onKeyPress?: (event: NativeSyntheticEvent<KeyPressEventData>) => void;
  style?: ViewStyle | ((state: SliderThumbState) => ViewStyle | undefined);
}

export interface SliderLabelProps extends TextProps, WebAccessibilityProps {
  children?: React.ReactNode;
}

export interface SliderValueProps
  extends Omit<TextProps, 'children'>, WebAccessibilityProps {
  children?:
    | React.ReactNode
    | ((formattedValues: string[], values: number[]) => React.ReactNode);
}
