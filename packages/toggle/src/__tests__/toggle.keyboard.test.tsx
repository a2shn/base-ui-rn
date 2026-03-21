import {
  ACTIVATION_KEYS,
  DEFAULT_HINT,
  DPAD_KEYS,
  NON_ACTIVATION_KEYS,
} from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Toggle } from '../toggle';

describe('Toggle - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('toggles state when Space or Enter is pressed', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} onPressedChange={onChangeMock}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Test Space
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: ' ' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(true, {
        source: 'keyboard',
      });

      // Test Enter
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).toHaveBeenLastCalledWith(false, {
        source: 'keyboard',
      });
    });

    it('triggers onPressedChange for all activation keys', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} onPressedChange={onChangeMock}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(toggle, 'keyDown', { nativeEvent: { key } });
      });

      expect(onChangeMock).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('ignores hardware keys when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onChangeMock}
        >
          <Text>Disabled Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('blocks all keyboard activation keys when disabled even if focusable', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPressedChange={onChangeMock}
        >
          <Text>Loading Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(toggle, 'keyDown', { nativeEvent: { key } });
      });

      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Non-Activation Keys', () => {
    it('does not toggle for non-activation keys', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      NON_ACTIVATION_KEYS.forEach((key) => {
        fireEvent(toggle, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPressedChange for D-pad navigation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} onPressedChange={onPressMock}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      DPAD_KEYS.forEach((key) => {
        fireEvent(toggle, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyDown Callback', () => {
    it('forwards all key events to onKeyDown callback', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onKeyDownMock).toHaveBeenCalledTimes(2);
    });

    it('forwards both activation and non-activation keys to onKeyDown', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });

      expect(onKeyDownMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('focusableWhenDisabled with Keyboard', () => {
    it('restores full interaction when re-enabled after disabled + focusableWhenDisabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole, rerender } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPressedChange={onChangeMock}
        >
          <Text>Loading Toggle</Text>
        </Toggle>,
      );

      const loadingToggle = getByRole('checkbox');
      expect(loadingToggle.props.focusable).toBe(true);
      expect(loadingToggle.props.accessibilityState.disabled).toBe(true);

      fireEvent(loadingToggle, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).not.toHaveBeenCalled();

      rerender(
        <Toggle accessibilityHint={DEFAULT_HINT} onPressedChange={onChangeMock}>
          <Text>Active Toggle</Text>
        </Toggle>,
      );

      const activeToggle = getByRole('checkbox');
      expect(activeToggle.props.focusable).toBe(true);
      expect(activeToggle.props.accessibilityState.disabled).toBe(false);

      fireEvent(activeToggle, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
