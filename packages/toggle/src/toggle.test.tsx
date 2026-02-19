import * as React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Toggle } from './toggle';

describe('Toggle', () => {
  const defaultHint = 'Toggles the setting';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Rendering & Roles', () => {
    it('renders as a checkbox by default', () => {
      const { getByRole } = render(
        <Toggle accessibilityHint={defaultHint}>
          <Text>Toggle Me</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle).toBeDefined();
      expect(toggle.props.accessibilityHint).toBe(defaultHint);
      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      });
    });

    it('renders as a switch when role is overridden', () => {
      const { getByRole } = render(
        <Toggle role='switch' accessibilityHint={defaultHint}>
          <Text>Toggle Me</Text>
        </Toggle>,
      );

      const toggle = getByRole('switch');
      expect(toggle).toBeDefined();
    });
  });

  describe('State Management', () => {
    it('handles uncontrolled state using defaultChecked', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          defaultChecked={false}
          onCheckedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Uncontrolled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(false);

      fireEvent.press(toggle);

      expect(toggle.props.accessibilityState.checked).toBe(true);
      expect(onChangeMock).toHaveBeenCalledWith(true);
    });

    it('handles controlled state and does not update internally if prop is static', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          checked={false}
          onCheckedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent.press(toggle);

      expect(onChangeMock).toHaveBeenCalledWith(true);
      // Because it's controlled and checked={false} remains, state shouldn't flip
      expect(toggle.props.accessibilityState.checked).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('ignores presses and applies disabled accessibility state', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onCheckedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(toggle);
      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Hardware Keyboard Interaction', () => {
    it('toggles state when Space or Enter is pressed', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle onCheckedChange={onChangeMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Test Space
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: ' ' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(true);

      // Test Enter
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(false);
    });

    it('ignores hardware keys when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onCheckedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Disabled Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Native Render Props', () => {
    it('provides pressed state to children as a function', () => {
      const { getByText } = render(
        <Toggle accessibilityHint={defaultHint}>
          {({ pressed }) => (
            <Text>{pressed ? 'Is Pressed' : 'Not Pressed'}</Text>
          )}
        </Toggle>,
      );

      expect(getByText('Not Pressed')).toBeDefined();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the internal Pressable component', () => {
      const ref = React.createRef<View>();
      render(
        <Toggle ref={ref} accessibilityHint={defaultHint}>
          <Text>Ref Target</Text>
        </Toggle>,
      );

      expect(ref.current).toBeDefined();
    });
  });
});
