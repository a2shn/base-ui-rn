import { fireEvent, render, screen } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Toggle } from './index';

describe('Toggle Primitive (Integration)', () => {
  describe('Basic Rendering & Uncontrolled State', () => {
    it('renders and toggles state correctly when uncontrolled', () => {
      const onPressedChangeMock = jest.fn();
      render(
        <Toggle
          onPressedChange={onPressedChangeMock}
          testID='uncontrolled-toggle'
        >
          {({ pressed }) => <Text>{pressed ? 'ON' : 'OFF'} </Text>}
        </Toggle>,
      );

      const toggle = screen.getByTestId('uncontrolled-toggle');

      expect(screen.getByText('OFF')).toBeTruthy();
      expect(toggle.props.accessibilityState).toEqual(
        expect.objectContaining({ checked: false }),
      );

      fireEvent.press(toggle);

      expect(screen.getByText('ON')).toBeTruthy();
      expect(toggle.props.accessibilityState).toEqual(
        expect.objectContaining({ checked: true }),
      );
      expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
      expect(onPressedChangeMock).toHaveBeenCalledWith(true);
    });

    it('respects defaultPressed', () => {
      render(
        <Toggle defaultPressed testID='default-pressed-toggle'>
          {({ pressed }) => <Text>{pressed ? 'ON' : 'OFF'} </Text>}
        </Toggle>,
      );

      expect(screen.getByText('ON')).toBeTruthy();
    });
  });

  describe('Controlled State', () => {
    it('does not change internal state when controlled but fires onPressedChange', () => {
      const onPressedChangeMock = jest.fn();
      render(
        <Toggle
          onPressedChange={onPressedChangeMock}
          pressed={true}
          testID='controlled-toggle'
        >
          {({ pressed }) => <Text>{pressed ? 'ON' : 'OFF'} </Text>}
        </Toggle>,
      );

      const toggle = screen.getByTestId('controlled-toggle');

      expect(screen.getByText('ON')).toBeTruthy();

      fireEvent.press(toggle);

      expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
      expect(onPressedChangeMock).toHaveBeenCalledWith(false);

      expect(screen.getByText('ON')).toBeTruthy();
    });
  });

  describe('Disabled State Wiring', () => {
    it('prevents interactions and updates accessibility state', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();

      render(
        <Toggle
          disabled
          onPress={onPressMock}
          onPressedChange={onPressedChangeMock}
          testID='disabled-toggle'
        >
          {({ disabled }) => <Text>{disabled ? 'LOCKED' : 'ACTIVE'} </Text>}
        </Toggle>,
      );

      const toggle = screen.getByTestId('disabled-toggle', {
        includeHiddenElements: true,
      });

      expect(toggle.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true }),
      );

      fireEvent.press(toggle);

      expect(onPressedChangeMock).not.toHaveBeenCalled();
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('successfully forwards a ref to the underlying component', () => {
      const ref = React.createRef<View>();

      render(
        <Toggle ref={ref} testID='ref-toggle'>
          <Text>Ref </Text>
        </Toggle>,
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current).toHaveProperty('measure');
    });
  });

  describe('Event Deduplication & Custom Callbacks', () => {
    it('deduplicates a synthesized ghost press following a keyboard activation', () => {
      const onPressedChangeMock = jest.fn();
      render(
        <Toggle onPressedChange={onPressedChangeMock} testID='dedup-toggle'>
          <Text>Dedup </Text>
        </Toggle>,
      );

      const toggle = screen.getByTestId('dedup-toggle');

      if (toggle.props.onKeyDown) {
        toggle.props.onKeyDown({ nativeEvent: { key: 'Enter' } });
      }

      if (toggle.props.onPress) {
        toggle.props.onPress({ nativeEvent: {} });
      }

      expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
      expect(onPressedChangeMock).toHaveBeenCalledWith(true);
    });

    it('allows the user to call e.preventDefault on the composed event', () => {
      const preventDefaultMock = jest.fn();
      const onPressMock = jest.fn((e) => {
        if (e && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
      });

      render(
        <Toggle onPress={onPressMock} testID='prevent-default-toggle'>
          <Text>Prevent Default </Text>
        </Toggle>,
      );

      const toggle = screen.getByTestId('prevent-default-toggle');

      fireEvent.press(toggle, { preventDefault: preventDefaultMock });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(preventDefaultMock).toHaveBeenCalledTimes(1);
    });

    it('executes user-provided custom callbacks exactly once per interaction', () => {
      const customOnPress = jest.fn();
      const customOnKeyDown = jest.fn();
      const customOnPressedChange = jest.fn();

      render(
        <Toggle
          onKeyDown={customOnKeyDown}
          onPress={customOnPress}
          onPressedChange={customOnPressedChange}
          testID='custom-cb-toggle'
        >
          <Text>Callbacks </Text>
        </Toggle>,
      );

      const toggle = screen.getByTestId('custom-cb-toggle');

      fireEvent.press(toggle);
      expect(customOnPress).toHaveBeenCalledTimes(1);
      expect(customOnPressedChange).toHaveBeenCalledTimes(1);
      expect(customOnPressedChange).toHaveBeenCalledWith(true);

      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Escape' } });
      expect(customOnKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
