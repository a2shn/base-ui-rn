import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PressableWithKeyPress } from '../pressable';
import { Text } from 'react-native';

describe('PressableWithKeyPress: Keyboard', () => {
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
});
