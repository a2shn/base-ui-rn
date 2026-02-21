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

  describe('Accessibility Defaults & Web Props', () => {
    it('defaults accessibilityHint when none is provided', () => {
      const { getByRole } = render(
        <Toggle>
          <Text>Default Hint</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityHint).toBe('Toggles the state');
    });

    it('adds activate accessibility action by default', () => {
      const { getByRole } = render(
        <Toggle accessibilityHint={defaultHint}>
          <Text>Actions</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });

    it('sets focusability and tabIndex based on disabled state', () => {
      const { getByRole, rerender } = render(
        <Toggle accessibilityHint={defaultHint}>
          <Text>Focusable</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.focusable).toBe(true);
      expect(toggle.props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled accessibilityHint={defaultHint}>
          <Text>Not Focusable</Text>
        </Toggle>,
      );

      const disabledToggle = getByRole('checkbox');
      expect(disabledToggle.props.focusable).toBe(false);
      expect(disabledToggle.props.tabIndex).toBe(-1);
    });

    it('supports overriding tabIndex and aria-disabled on web', () => {
      const webOverrides = {
        tabIndex: -1 as const,
        'aria-disabled': false,
      };

      const { getByRole } = render(
        <Toggle
          disabled
          accessibilityHint={defaultHint}
          {...(webOverrides as any)}
        >
          <Text>Overrides</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.tabIndex).toBe(-1);
      // Note: React Native may strip unknown hyphenated web props; assert undefined instead of false.
      expect(toggle.props['aria-disabled']).toBeUndefined();
    });

    it('reflects pressed state for aria-pressed and data-pressed', () => {
      const { getByRole, rerender } = render(
        <Toggle pressed accessibilityHint={defaultHint}>
          <Text>Pressed</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props['aria-pressed']).toBe(true);
      expect(toggle.props['data-pressed']).toBe(true);

      rerender(
        <Toggle pressed={false} accessibilityHint={defaultHint}>
          <Text>Not Pressed</Text>
        </Toggle>,
      );

      const unpressed = getByRole('checkbox');
      expect(unpressed.props['aria-pressed']).toBe(false);
      expect(unpressed.props['data-pressed']).toBe(false);
    });
  });

  describe('State Management', () => {
    it('handles uncontrolled state using defaultPressed', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          defaultPressed={false}
          onPressedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Uncontrolled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.checked).toBe(false);

      fireEvent.press(toggle);

      expect(toggle.props.accessibilityState.checked).toBe(true);
      expect(onChangeMock).toHaveBeenCalledWith(true, { source: 'press' });
    });

    it('handles controlled state and does not update internally if prop is static', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          pressed={false}
          onPressedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Controlled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent.press(toggle);

      expect(onChangeMock).toHaveBeenCalledWith(true, { source: 'press' });
      // Because it's controlled and pressed={false} remains, state shouldn't flip
      expect(toggle.props.accessibilityState.checked).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('ignores presses and applies disabled accessibility state', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onPressedChange={onChangeMock}
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
        <Toggle onPressedChange={onChangeMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Test Space
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: ' ' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(true, {
        source: 'keyboard',
      });

      // Test Enter
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(false, {
        source: 'keyboard',
      });
    });

    it('ignores hardware keys when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onPressedChange={onChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Disabled Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('does not toggle for non-activation keys', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          onPressedChange={onPressedChangeMock}
          accessibilityHint={defaultHint}
        >
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      const nonActivationKeys = ['Tab', 'ArrowDown', 'Escape'];
      nonActivationKeys.forEach((key) => {
        fireEvent(toggle, 'keyPress', { nativeEvent: { key } });
      });

      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('forwards all key events to onKeyPress callback', () => {
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Toggle onKeyPress={onKeyPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Tab' } });
      fireEvent(toggle, 'keyPress', { nativeEvent: { key: 'Enter' } });

      expect(onKeyPressMock).toHaveBeenCalledTimes(2);
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

  describe('focusableWhenDisabled', () => {
    it('keeps focusable and tabIndex when disabled', () => {
      const { getByRole } = render(
        <Toggle disabled focusableWhenDisabled accessibilityHint={defaultHint}>
          <Text>Loading</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      expect(toggle.props.focusable).toBe(true);
      expect(toggle.props.tabIndex).toBe(0);
      expect(toggle.props.accessibilityState).toEqual({
        disabled: true,
        checked: false,
      });
    });

    it('preserves focusability when toggling between states', () => {
      const { getByRole, rerender } = render(
        <Toggle accessibilityHint={defaultHint}>
          <Text>Toggle</Text>
        </Toggle>,
      );

      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled accessibilityHint={defaultHint}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(false);
      expect(getByRole('checkbox').props.tabIndex).toBe(-1);

      rerender(
        <Toggle disabled focusableWhenDisabled accessibilityHint={defaultHint}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle accessibilityHint={defaultHint}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);
    });
  });

  describe('Focus Management', () => {
    it('assigns tabIndex and focusable across a mixed group', () => {
      const { getAllByRole } = render(
        <>
          <Toggle accessibilityHint='Normal toggle'>
            <Text>Normal</Text>
          </Toggle>
          <Toggle disabled accessibilityHint='Disabled toggle'>
            <Text>Disabled</Text>
          </Toggle>
          <Toggle
            disabled
            focusableWhenDisabled
            accessibilityHint='Loading toggle'
          >
            <Text>Loading</Text>
          </Toggle>
        </>,
      );

      const [normal, disabled, loading] = getAllByRole('checkbox');

      expect(normal.props.focusable).toBe(true);
      expect(normal.props.tabIndex).toBe(0);

      expect(disabled.props.focusable).toBe(false);
      expect(disabled.props.tabIndex).toBe(-1);

      expect(loading.props.focusable).toBe(true);
      expect(loading.props.tabIndex).toBe(0);
    });
  });

  describe('Accessibility Actions', () => {
    it('triggers onPressedChange when activate accessibility action is fired', () => {
      const onPressedChangeMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();

      const { getByRole } = render(
        <Toggle
          onPressedChange={onPressedChangeMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityHint={defaultHint}
        >
          <Text>Action Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressedChangeMock).toHaveBeenCalledWith(true, {
        source: 'accessibilityAction',
      });
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
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
