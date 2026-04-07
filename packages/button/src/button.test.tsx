import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Button } from './index';

describe('Button Primitive (Integration)', () => {
  describe('Basic Rendering & Interaction', () => {
    it('renders children and responds to press events', () => {
      const onPressMock = jest.fn();
      render(
        <Button onPress={onPressMock} testID='standard-button'>
          <Text>Click Me</Text>
        </Button>,
      );

      const button = screen.getByTestId('standard-button');

      expect(screen.getByText('Click Me')).toBeTruthy();

      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('handles complex event composition (press in/out)', () => {
      const onPressInMock = jest.fn();
      const onPressOutMock = jest.fn();

      render(
        <Button
          onPressIn={onPressInMock}
          onPressOut={onPressOutMock}
          testID='press-events-btn'
        >
          <Text>Interact</Text>
        </Button>,
      );

      const button = screen.getByTestId('press-events-btn');

      fireEvent(button, 'pressIn');
      expect(onPressInMock).toHaveBeenCalledTimes(1);

      fireEvent(button, 'pressOut');
      expect(onPressOutMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Render Props & Internal State Wiring', () => {
    it('exposes the "pressed" state to the children function during interaction', () => {
      render(
        <Button testID='render-prop-btn'>
          {({ pressed }) => (
            <Text>{pressed ? 'I am pressed!' : 'I am resting'}</Text>
          )}
        </Button>,
      );

      const button = screen.getByTestId('render-prop-btn');

      expect(screen.getByText('I am resting')).toBeTruthy();

      fireEvent(button, 'pressIn');

      expect(screen.getByText('I am pressed!')).toBeTruthy();

      fireEvent(button, 'pressOut');
      expect(screen.getByText('I am resting')).toBeTruthy();
    });

    it('exposes the "focused" state to the children function', () => {
      render(
        <Button testID='focus-btn'>
          {({ focused }) => <Text>{focused ? 'Has Focus' : 'No Focus'}</Text>}
        </Button>,
      );

      const button = screen.getByTestId('focus-btn');

      expect(screen.getByText('No Focus')).toBeTruthy();

      fireEvent(button, 'focus');
      expect(screen.getByText('Has Focus')).toBeTruthy();

      fireEvent(button, 'blur');
      expect(screen.getByText('No Focus')).toBeTruthy();
    });
  });

  describe('Disabled State Wiring', () => {
    it('prevents onPress from firing when disabled and updates accessibility state', () => {
      const onPressMock = jest.fn();

      render(
        <Button disabled onPress={onPressMock} testID='disabled-btn'>
          {({ disabled }) => (
            <Text>{disabled ? 'Disabled Text' : 'Active Text'}</Text>
          )}
        </Button>,
      );

      const button = screen.getByTestId('disabled-btn');

      expect(screen.getByText('Disabled Text')).toBeTruthy();

      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      );

      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('successfully forwards a ref to the underlying View/Pressable', () => {
      const ref = React.createRef<View>();

      render(
        <Button ref={ref} testID='ref-btn'>
          <Text>Ref Test</Text>
        </Button>,
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current).toHaveProperty('measure');
    });
  });

  describe('Custom Callbacks', () => {
    it('allows the user to call e.preventDefault on the composed event', () => {
      const preventDefaultMock = jest.fn();
      const onPressMock = jest.fn((e) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
      });

      render(
        <Button onPress={onPressMock} testID='prevent-default-btn'>
          <Text>Prevent Default</Text>
        </Button>,
      );

      const button = screen.getByTestId('prevent-default-btn');

      fireEvent.press(button, { preventDefault: preventDefaultMock });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    });

    it('executes user-provided custom callbacks exactly once per interaction', () => {
      const customOnPress = jest.fn();
      const customOnKeyDown = jest.fn();

      render(
        <Button
          onKeyDown={customOnKeyDown}
          onPress={customOnPress}
          testID='custom-cb-btn'
        >
          <Text>Custom Callbacks</Text>
        </Button>,
      );

      const button = screen.getByTestId('custom-cb-btn');

      fireEvent.press(button);
      expect(customOnPress).toHaveBeenCalledTimes(1);

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Escape' } });
      expect(customOnKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
