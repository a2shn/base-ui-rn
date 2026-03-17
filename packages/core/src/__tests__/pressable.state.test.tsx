import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: State', () => {
  it('should call onPress when pressed', () => {
    const handlePress = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress testID='test-pressable' onPress={handlePress}>
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent.press(getByTestId('test-pressable'));
    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('should call onPressIn when press starts', () => {
    const handlePressIn = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress testID='test-pressable' onPressIn={handlePressIn}>
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
        testID='test-pressable'
        onPressOut={handlePressOut}
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
        testID='test-pressable'
        onPress={handlePress}
        disabled
      >
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );

    fireEvent.press(getByTestId('test-pressable'));
    expect(handlePress).not.toHaveBeenCalled();
  });
});
