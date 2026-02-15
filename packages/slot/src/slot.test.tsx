import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { Slot } from './slot';

describe('Slot', () => {
  it('renders child element', () => {
    const { getByText } = render(
      <Slot>
        <Text>Hello</Text>
      </Slot>,
    );

    expect(getByText('Hello')).toBeTruthy();
  });

  it('merges onPress handlers', () => {
    const parentPress = jest.fn();
    const childPress = jest.fn();

    const { getByText } = render(
      <Slot onPress={parentPress}>
        <Pressable accessibilityRole='button' onPress={childPress}>
          <Text>Press</Text>
        </Pressable>
      </Slot>,
    );

    fireEvent.press(getByText('Press'));

    expect(childPress).toHaveBeenCalled();
    expect(parentPress).toHaveBeenCalled();
  });

  it('forwards refs correctly', () => {
    const ref = React.createRef<Text>();

    render(
      <Slot ref={ref}>
        <Text>Ref</Text>
      </Slot>,
    );

    expect(ref.current).toBeTruthy();
  });

  it('preserves accessibilityRole', () => {
    const { getByRole } = render(
      <Slot accessibilityRole='button'>
        <Pressable accessibilityRole='button'>
          <Text>Tap</Text>
        </Pressable>
      </Slot>,
    );

    expect(getByRole('button')).toBeTruthy();
  });
});
