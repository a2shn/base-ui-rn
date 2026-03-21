import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { useKeyboardNavigation } from '../keyboard';
import { PressableWithKeyPress } from '../pressable';

// Mock the useKeyboardNavigation hook
jest.mock('../keyboard', () => ({
  useKeyboardNavigation: jest.fn(() => ({
    handleKeyDown: jest.fn(),
    navigate: jest.fn(),
    registerItem: jest.fn(),
  })),
}));

describe('PressableWithKeyPress: Keyboard Navigation', () => {
  it('should call onKeyDown when a key is pressed, allowing parent to handle navigation', () => {
    const mockHandleKeyDown = jest.fn();
    (useKeyboardNavigation as jest.Mock).mockReturnValue({
      handleKeyDown: mockHandleKeyDown,
      navigate: jest.fn(),
      registerItem: jest.fn(),
    });

    const TestComponent = () => {
      const { handleKeyDown, registerItem } = useKeyboardNavigation();
      const ref = React.useRef(null);
      React.useEffect(() => {
        registerItem('test-item', ref);
      }, [registerItem]);

      return (
        <PressableWithKeyPress
          onKeyDown={(e) => handleKeyDown('test-item', e)}
          ref={ref}
          testID='nav-pressable'
        >
          <Text>Navigable Button</Text>
        </PressableWithKeyPress>
      );
    };

    const { getByTestId } = render(<TestComponent />);
    const pressable = getByTestId('nav-pressable');

    fireEvent(pressable, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    expect(mockHandleKeyDown).toHaveBeenCalledTimes(1);
    expect(mockHandleKeyDown).toHaveBeenCalledWith(
      'test-item',
      expect.objectContaining({ nativeEvent: { key: 'ArrowRight' } }),
    );

    fireEvent(pressable, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
    expect(mockHandleKeyDown).toHaveBeenCalledTimes(2);
    expect(mockHandleKeyDown).toHaveBeenCalledWith(
      'test-item',
      expect.objectContaining({ nativeEvent: { key: 'ArrowDown' } }),
    );
  });

  // This component itself does not perform navigation, but it should pass the events.
  // The actual navigation logic is handled by the `useKeyboardNavigation` hook in a parent.
  // This test ensures that the `onKeyDown` prop is properly used.
});
