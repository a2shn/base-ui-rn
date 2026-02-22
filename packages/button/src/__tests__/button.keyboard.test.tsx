import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { Button } from '../button';
import {
  DEFAULT_HINT,
  fireKeyPress,
  ACTIVATION_KEYS,
  NON_ACTIVATION_KEYS,
  DPAD_KEYS,
} from '@base-ui-rn/test-utils';

describe('Button - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('triggers onPress for all activation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(button, key);
      });

      expect(onPressMock).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('triggers onPress for Space and Enter keys specifically', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, ' ');
      expect(onPressMock).toHaveBeenCalledTimes(1);

      fireKeyPress(button, 'Enter');
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });

    it('ignores hardware keyboard events when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireKeyPress(button, 'Enter');

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('blocks all keyboard activation keys when disabled even if focusable', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(button, key);
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Non-Activation Keys', () => {
    it('does not trigger onPress for navigation and modifier keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      NON_ACTIVATION_KEYS.forEach((key) => {
        fireKeyPress(button, key);
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPress for D-pad navigation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      DPAD_KEYS.forEach((key) => {
        fireKeyPress(button, key);
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyPress Callback', () => {
    it('forwards all key events to onKeyPress callback regardless of key type', () => {
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Button onKeyPress={onKeyPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Tab');
      fireKeyPress(button, 'Enter');
      fireKeyPress(button, 'ArrowDown');

      expect(onKeyPressMock).toHaveBeenCalledTimes(3);
    });

    it('forwards activation keys to both onPress and onKeyPress', () => {
      const onPressMock = jest.fn();
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPress={onPressMock}
          onKeyPress={onKeyPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Enter');

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(onKeyPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('focusableWhenDisabled with Keyboard', () => {
    it('restores full interaction when re-enabled after disabled + focusableWhenDisabled', () => {
      const onPressMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const loadingButton = getByRole('button');
      expect(loadingButton.props.focusable).toBe(true);
      expect(loadingButton.props.accessibilityState.disabled).toBe(true);

      fireKeyPress(loadingButton, 'Enter');
      expect(onPressMock).not.toHaveBeenCalled();

      rerender(
        <Button onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Active Button</Text>
        </Button>,
      );

      const activeButton = getByRole('button');
      expect(activeButton.props.focusable).toBe(true);
      expect(activeButton.props.accessibilityState.disabled).toBe(false);

      fireKeyPress(activeButton, 'Enter');
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not affect onPress when button is enabled with focusableWhenDisabled set', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Enter');

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });
});
