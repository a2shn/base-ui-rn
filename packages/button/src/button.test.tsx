import * as React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Root as Button } from './button';

describe('Button.Root', () => {
  const defaultHint = 'Triggers an action';

  describe('Standard Rendering', () => {
    it('renders as a Pressable by default with base accessibility', () => {
      const { getByRole } = render(
        <Button accessibilityHint={defaultHint}>
          <Text>Click Me</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button).toBeDefined();
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityHint).toBe(defaultHint);
      expect(button.props.focusable).toBe(true);
      expect(button.props.accessibilityState).toEqual({ disabled: false });
    });

    it('triggers onPress when interacted with', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Click Me</Text>
        </Button>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('applies disabled state correctly across all accessibility layers', () => {
      const { getByRole } = render(
        <Button disabled accessibilityHint={defaultHint}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(false);
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('Native Render Props (children as function)', () => {
    it('supports React Native press state via render props', () => {
      const { getByText } = render(
        <Button accessibilityHint={defaultHint}>
          {({ pressed }) => (
            <Text>{pressed ? 'Pressed State' : 'Normal State'}</Text>
          )}
        </Button>,
      );

      // Verifies the function is executed and renders the correct initial state
      expect(getByText('Normal State')).toBeDefined();
    });
  });

  describe('Hardware Keyboard Accessibility', () => {
    it('triggers onPress when Enter or Space is pressed', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Simulate Space key
      fireEvent(button, 'keyPress', { nativeEvent: { key: ' ' } });
      expect(onPressMock).toHaveBeenCalledTimes(1);

      // Simulate Enter key
      fireEvent(button, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });

    it('ignores hardware keyboard events when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the native Pressable wrapper', () => {
      const ref = React.createRef<View>();

      render(
        <Button ref={ref} accessibilityHint={defaultHint}>
          <Text>Ref Test</Text>
        </Button>,
      );

      // In React Native testing library, refs point to the native host component
      expect(ref.current).toBeDefined();
    });
  });
});
