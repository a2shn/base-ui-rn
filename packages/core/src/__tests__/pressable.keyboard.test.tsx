import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: Keyboard', () => {
  it('should call onKeyDown when a key is pressed down', () => {
    const handleKeyDown = jest.fn();
    const { getByTestId } = render(
      <PressableWithKeyPress onKeyDown={handleKeyDown} testID='test-pressable'>
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
