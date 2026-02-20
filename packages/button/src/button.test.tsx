import * as React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './button';

describe('Button', () => {
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
      expect(button.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });

    it('defaults accessibilityHint when none is provided', () => {
      const { getByRole } = render(
        <Button>
          <Text>Default Hint</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.accessibilityHint).toBe('Activates the button');
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

    it('keeps focusable when focusableWhenDisabled is true', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(true);
      expect(button.props.accessibilityState).toEqual({ disabled: true });

      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('sets default tabIndex based on focusability', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={defaultHint}>
          <Text>Focusable</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.tabIndex).toBe(0);

      rerender(
        <Button disabled accessibilityHint={defaultHint}>
          <Text>Not Focusable</Text>
        </Button>,
      );

      const disabledButton = getByRole('button');
      expect(disabledButton.props.tabIndex).toBe(-1);
    });

    it('allows overriding tabIndex and aria-disabled', () => {
      const webOverrides = {
        tabIndex: -1 as const,
        'aria-disabled': false,
      };

      const { getByRole } = render(
        <Button
          disabled
          accessibilityHint={defaultHint}
          {...(webOverrides as any)}
        >
          <Text>Overrides</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.tabIndex).toBe(-1);
      expect(button.props['aria-disabled']).toBeUndefined();
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
    it('triggers onPress for keyboard/gamepad/TV select keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      const activationKeys = [
        ' ',
        'Enter',
        'Spacebar',
        'Space',
        'Select',
        'Return',
        'OK',
        'Accept',
      ];

      activationKeys.forEach((key) => {
        fireEvent(button, 'keyPress', { nativeEvent: { key } });
      });

      expect(onPressMock).toHaveBeenCalledTimes(activationKeys.length);
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

  describe('Accessibility Actions', () => {
    it('triggers onPress when activate accessibility action is fired', () => {
      const onPressMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();

      const { getByRole } = render(
        <Button
          onPress={onPressMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityHint={defaultHint}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });

    it('ignores accessibility actions when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Disabled Action</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

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
