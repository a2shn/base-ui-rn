import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableWithKeyPress } from '../pressable';
import { useKeyboardNavigation } from '../keyboard';

// Mock the useKeyboardNavigation hook
jest.mock('../keyboard', () => ({
  useKeyboardNavigation: jest.fn(() => ({
    registerItem: jest.fn(),
    handleKeyDown: jest.fn(),
    navigate: jest.fn(),
  })),
}));

describe('PressableWithKeyPress: Keyboard Navigation', () => {
  it('should call onKeyDown when a key is pressed, allowing parent to handle navigation', () => {
    const mockHandleKeyDown = jest.fn();
    (useKeyboardNavigation as jest.Mock).mockReturnValue({
      registerItem: jest.fn(),
      handleKeyDown: mockHandleKeyDown,
      navigate: jest.fn(),
    });

    const TestComponent = () => {
      const { registerItem, handleKeyDown } = useKeyboardNavigation();
      const ref = React.useRef(null);
      React.useEffect(() => {
        registerItem('test-item', ref);
      }, [registerItem]);

      return (
        <PressableWithKeyPress
          testID='nav-pressable'
          ref={ref}
          onKeyDown={(e) => handleKeyDown('test-item', e)}
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
