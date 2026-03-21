import {
  ACTIVATION_KEYS,
  DEFAULT_HINT,
  DPAD_KEYS,
  NON_ACTIVATION_KEYS,
} from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('triggers onPress for all activation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('triggers onPress for Space and Enter keys specifically', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: ' ' } });
      expect(onPressMock).toHaveBeenCalledTimes(1);

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });

    it('ignores hardware keyboard events when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('blocks all keyboard activation keys when disabled even if focusable', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Non-Activation Keys', () => {
    it('does not trigger onPress for navigation and modifier keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      NON_ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPress for D-pad navigation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      DPAD_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyDown Callback', () => {
    it('forwards all key events to onKeyDown callback regardless of key type', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });

      expect(onKeyDownMock).toHaveBeenCalledTimes(3);
    });

    it('forwards activation keys to both onPress and onKeyDown', () => {
      const onPressMock = jest.fn();
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onKeyDown={onKeyDownMock}
          onPress={onPressMock}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(onKeyDownMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('focusableWhenDisabled with Keyboard', () => {
    it('restores full interaction when re-enabled after disabled + focusableWhenDisabled', () => {
      const onPressMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const loadingButton = getByRole('button');
      expect(loadingButton.props.focusable).toBe(true);
      expect(loadingButton.props.accessibilityState.disabled).toBe(true);

      fireEvent(loadingButton, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Active Button</Text>
        </Button>,
      );

      const activeButton = getByRole('button');
      expect(activeButton.props.focusable).toBe(true);
      expect(activeButton.props.accessibilityState.disabled).toBe(false);

      fireEvent(activeButton, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not affect onPress when button is enabled with focusableWhenDisabled set', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          focusableWhenDisabled
          onPress={onPressMock}
        >
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });
});
