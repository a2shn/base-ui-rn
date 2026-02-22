import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Toggle } from '../toggle';
import {
  DEFAULT_HINT,
  fireKeyPress,
  ACTIVATION_KEYS,
  NON_ACTIVATION_KEYS,
  DPAD_KEYS,
} from '@base-ui-rn/test-utils';

describe('Toggle - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('toggles state when Space or Enter is pressed', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle onPressedChange={onChangeMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Test Space
      fireKeyPress(toggle, ' ');
      expect(onChangeMock).toHaveBeenLastCalledWith(true, {
        source: 'keyboard',
      });

      // Test Enter
      fireKeyPress(toggle, 'Enter');
      expect(onChangeMock).toHaveBeenLastCalledWith(false, {
        source: 'keyboard',
      });
    });

    it('triggers onPressedChange for all activation keys', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle onPressedChange={onChangeMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(toggle, key);
      });

      expect(onChangeMock).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('ignores hardware keys when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onPressedChange={onChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      fireKeyPress(toggle, 'Enter');

      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('blocks all keyboard activation keys when disabled even if focusable', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          focusableWhenDisabled
          onPressedChange={onChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(toggle, key);
      });

      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Non-Activation Keys', () => {
    it('does not toggle for non-activation keys', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      NON_ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(toggle, key);
      });

      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPressedChange for D-pad navigation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Toggle onPressedChange={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      DPAD_KEYS.forEach((key) => {
        fireKeyPress(toggle, key);
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyPress Callback', () => {
    it('forwards all key events to onKeyPress callback', () => {
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Toggle onKeyPress={onKeyPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireKeyPress(toggle, 'Tab');
      fireKeyPress(toggle, 'Enter');

      expect(onKeyPressMock).toHaveBeenCalledTimes(2);
    });

    it('forwards both activation and non-activation keys to onKeyPress', () => {
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Toggle onKeyPress={onKeyPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireKeyPress(toggle, 'Enter');
      fireKeyPress(toggle, 'Tab');
      fireKeyPress(toggle, 'ArrowDown');

      expect(onKeyPressMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('focusableWhenDisabled with Keyboard', () => {
    it('restores full interaction when re-enabled after disabled + focusableWhenDisabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole, rerender } = render(
        <Toggle
          disabled
          focusableWhenDisabled
          onPressedChange={onChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading Toggle</Text>
        </Toggle>,
      );

      const loadingToggle = getByRole('checkbox');
      expect(loadingToggle.props.focusable).toBe(true);
      expect(loadingToggle.props.accessibilityState.disabled).toBe(true);

      fireKeyPress(loadingToggle, 'Enter');
      expect(onChangeMock).not.toHaveBeenCalled();

      rerender(
        <Toggle onPressedChange={onChangeMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Active Toggle</Text>
        </Toggle>,
      );

      const activeToggle = getByRole('checkbox');
      expect(activeToggle.props.focusable).toBe(true);
      expect(activeToggle.props.accessibilityState.disabled).toBe(false);

      fireKeyPress(activeToggle, 'Enter');
      expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
  });
});
