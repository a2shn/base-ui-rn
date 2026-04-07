import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet, Text } from 'react-native';

import { Switch } from './index';

describe('Switch', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders unchecked by default', () => {
      render(
        <Switch.Root testID="switch-root">
          <Switch.Thumb testID="switch-thumb" />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      expect(root.props.accessibilityState).toMatchObject({
        checked: false,
        disabled: false,
      });
      expect(root.props.role).toBe('switch');
    });

    it('renders checked when defaultChecked is true', () => {
      render(
        <Switch.Root defaultChecked testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      expect(root.props.accessibilityState.checked).toBe(true);
    });

    it('toggles state on press when uncontrolled', () => {
      const onCheckedChange = jest.fn();
      render(
        <Switch.Root onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');

      // Press to check
      fireEvent.press(root);
      expect(root.props.accessibilityState.checked).toBe(true);
      expect(onCheckedChange).toHaveBeenCalledWith(true);

      // Press to uncheck
      fireEvent.press(root);
      expect(root.props.accessibilityState.checked).toBe(false);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Controlled State', () => {
    it('respects the checked prop and does not update internal state', () => {
      const onCheckedChange = jest.fn();
      const { rerender } = render(
        <Switch.Root checked={true} onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      expect(root.props.accessibilityState.checked).toBe(true);

      // Pressing should trigger the callback but NOT change the UI state
      fireEvent.press(root);
      expect(onCheckedChange).toHaveBeenCalledWith(false);
      expect(root.props.accessibilityState.checked).toBe(true);

      // Rerender with new prop to simulate parent component updating it
      rerender(
        <Switch.Root checked={false} onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );
      expect(root.props.accessibilityState.checked).toBe(false);
    });
  });

  describe('Disabled & Read-Only States', () => {
    it('prevents toggling and updates accessibilityState when disabled', () => {
      const onCheckedChange = jest.fn();
      render(
        <Switch.Root disabled onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      expect(root.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(root);
      expect(onCheckedChange).not.toHaveBeenCalled();
      expect(root.props.accessibilityState.checked).toBe(false);
    });

    it('prevents toggling when readOnly is true (but does not mark as visually disabled)', () => {
      const onCheckedChange = jest.fn();
      render(
        <Switch.Root readOnly onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');

      // ReadOnly elements are usually not marked as disabled in accessibility mapping natively
      expect(root.props.accessibilityState.disabled).toBe(false);

      fireEvent.press(root);
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('ignores keyboard events if disabled', () => {
      const onCheckedChange = jest.fn();
      render(
        <Switch.Root disabled onCheckedChange={onCheckedChange} testID="switch-root">
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      fireEvent(root, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onCheckedChange).not.toHaveBeenCalled();
    });
  });

  describe('Context & Style Resolution (Render Props)', () => {
    it('evaluates style functions on the Root based on state', () => {
      render(
        <Switch.Root
          testID="switch-root"
          style={({ checked }) => ({
            backgroundColor: checked ? 'green' : 'red',
          })}
        >
          <Switch.Thumb />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');

      let flattenedStyle = StyleSheet.flatten(root.props.style);
      expect(flattenedStyle).toMatchObject({ backgroundColor: 'red' });

      fireEvent.press(root);

      flattenedStyle = StyleSheet.flatten(root.props.style);
      expect(flattenedStyle).toMatchObject({ backgroundColor: 'green' });
    });

    it('evaluates style functions on the Thumb via Context', () => {
      render(
        <Switch.Root testID="switch-root">
          <Switch.Thumb
            testID="switch-thumb"
            style={({ checked }) => ({
              transform: [{ translateX: checked ? 20 : 0 }],
            })}
          />
        </Switch.Root>,
      );

      const root = screen.getByTestId('switch-root');
      const thumb = screen.getByTestId('switch-thumb');

      // Initially at 0
      let thumbStyle = StyleSheet.flatten(thumb.props.style);
      expect(thumbStyle).toMatchObject({ transform: [{ translateX: 0 }] });

      // Toggle to 20
      fireEvent.press(root);

      thumbStyle = StyleSheet.flatten(thumb.props.style);
      expect(thumbStyle).toMatchObject({ transform: [{ translateX: 20 }] });
    });

    it('exposes state to children as a function', () => {
      render(
        <Switch.Root testID="switch-root">
          {({ checked }) => <Text>{checked ? 'ON' : 'OFF'}</Text>}
        </Switch.Root>,
      );

      expect(screen.getByText('OFF')).toBeTruthy();

      fireEvent.press(screen.getByTestId('switch-root'));

      expect(screen.getByText('ON')).toBeTruthy();
      expect(screen.queryByText('OFF')).toBeNull();
    });
  });
});
