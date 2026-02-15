import * as React from 'react';
import { Text, View, Pressable } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Root as Toggle } from './toggle';

describe('Toggle.Root', () => {
  const defaultHint = 'Toggles the setting';

  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
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
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });

    it('handles controlled state without updating internally if prop does not change', () => {
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
      expect(toggle.props.accessibilityState.checked).toBe(false);

      fireEvent.press(toggle);

      // The callback is fired asking the parent to change the state to true
      expect(onChangeMock).toHaveBeenCalledWith(true);

      // But because the component is controlled and we didn't re-render with checked={true},
      // the internal accessibility tree remains false.
      expect(toggle.props.accessibilityState.checked).toBe(false);
    });
  });

  describe('Disabled State', () => {
    it('ignores presses and applies disabled accessibility state', () => {
      const onChangeMock = jest.fn();
      const onPressMock = jest.fn();

      const { getByRole } = render(
        <Toggle
          disabled
          onCheckedChange={onChangeMock}
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(toggle);

      expect(onChangeMock).not.toHaveBeenCalled();
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('asChild Polymorphism', () => {
    it('merges props into a child Pressable without warning', () => {
      const { getByTestId } = render(
        <Toggle asChild accessibilityHint={defaultHint} defaultChecked={true}>
          <Pressable
            testID='child-pressable'
            accessibilityLabel='Custom Label'
            accessibilityHint='Custom Hint'
          />
        </Toggle>,
      );

      const child = getByTestId('child-pressable');
      expect(child.props.accessibilityRole).toBe('checkbox');
      expect(child.props.accessibilityLabel).toBe('Custom Label');
      expect(child.props.accessibilityState.checked).toBe(true);
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('warns with correct identifier when a generic View is passed', () => {
      const { getByTestId } = render(
        // Move testID to the Root so the DX engine can read it
        <Toggle asChild testID='bad-child' accessibilityHint={defaultHint}>
          <View />
        </Toggle>,
      );

      // Slot correctly merges it down, so this still works!
      const child = getByTestId('bad-child');

      fireEvent.press(child);
      expect(child.props.accessibilityState.checked).toBe(true);

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[Base UI RN] <Toggle.Root asChild> was used with a non-Pressable child: <View> (Identifier: "bad-child").',
        ),
      );
    });

    it('falls back to accessibilityHint in the warning if testID is missing', () => {
      render(
        <Toggle asChild accessibilityHint='fallback-hint'>
          <Text>No test ID here</Text>
        </Toggle>,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[Base UI RN] <Toggle.Root asChild> was used with a non-Pressable child: <Text> (Identifier: "fallback-hint").',
        ),
      );
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the underlying child component when using asChild', () => {
      const ref = React.createRef<View>();

      render(
        <Toggle asChild ref={ref} accessibilityHint={defaultHint}>
          <Pressable accessibilityRole='button' testID='child-pressable' />
        </Toggle>,
      );

      expect(ref.current).toBeDefined();
      expect(ref.current?.props.testID).toBe('child-pressable');
    });
  });
});
