import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PressableWithKeyPress } from '../pressable';
import { Text } from 'react-native';
import { ACTIVATION_KEYS } from '../constants';

describe('PressableWithKeyPress: Keyboard', () => {
  it('should call onKeyPress when a key is pressed', () => {
    const handleKeyPress = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress
        testID='test-pressable'
        onKeyPress={handleKeyPress}
      >
        <Text>Press Me</Text>
      </PressableWithKeyPress>,
    );

    fireEvent(getByTestId('test-pressable'), 'keyPress', {
      nativeEvent: { key: 'a' },
    });
    expect(handleKeyPress).toHaveBeenCalledTimes(1);
    expect(handleKeyPress).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: { key: 'a' } }),
    );
  });

  it('should call onKeyDown when a key is pressed down', () => {
    const handleKeyDown = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress testID='test-pressable' onKeyDown={handleKeyDown}>
        <Text>Press Me</Text>
      </PressableWithKeyPress>,
    );

    fireEvent(getByTestId('test-pressable'), 'keyDown', {
      nativeEvent: { key: 'b' },
    });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
    expect(handleKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({ nativeEvent: { key: 'b' } }),
    );
  });

  it('should call onKeyPress for activation keys', () => {
    const handleKeyPress = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress
        testID='test-pressable'
        onKeyPress={handleKeyPress}
      >
        <Text>Press Me</Text>
      </PressableWithKeyPress>,
    );

    ACTIVATION_KEYS.forEach((key) => {
      fireEvent(getByTestId('test-pressable'), 'keyPress', {
        nativeEvent: { key },
      });
      expect(handleKeyPress).toHaveBeenCalledWith(
        expect.objectContaining({ nativeEvent: { key } }),
      );
    });
    expect(handleKeyPress).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
  });
});
