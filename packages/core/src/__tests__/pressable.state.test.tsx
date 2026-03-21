import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: State', () => {
  it('should call onPress when pressed', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress onPress={handlePress} testID='test-pressable'>
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent.press(getByTestId('test-pressable'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('should call onPressIn when press starts', () => {
    const handlePressIn = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress onPressIn={handlePressIn} testID='test-pressable'>
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent(getByTestId('test-pressable'), 'pressIn');
    expect(handlePressIn).toHaveBeenCalledTimes(1);
  });

  it('should call onPressOut when press ends', () => {
    const handlePressOut = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress
        onPressOut={handlePressOut}
        testID='test-pressable'
      >
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent(getByTestId('test-pressable'), 'pressOut');
    expect(handlePressOut).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress
        disabled
        onPress={handlePress}
        testID='test-pressable'
      >
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent.press(getByTestId('test-pressable'));
    expect(handlePress).not.toHaveBeenCalled();
  });
});
