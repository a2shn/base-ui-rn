import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';
import {
  DEFAULT_HINT,
  fireKeyPress,
  fireAccessibilityAction,
} from '@base-ui-rn/test-utils';

describe('Button - Disabled State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Disabled Behavior', () => {
    it('ignores presses when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('applies disabled accessibility state', () => {
      const { getByRole } = render(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.accessibilityState).toEqual({ disabled: true });
      expect(button.props.focusable).toBe(false);
    });

    it('makes button non-focusable when disabled', () => {
      const { getByRole } = render(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(false);
      expect(button.props.tabIndex).toBe(-1);
    });
  });

  describe('focusableWhenDisabled', () => {
    it('keeps focusable when focusableWhenDisabled is true', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(true);
      expect(button.props.tabIndex).toBe(0);
      expect(button.props.accessibilityState).toEqual({ disabled: true });

      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('blocks accessibility actions when disabled even if focusable', () => {
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

      fireAccessibilityAction(button, 'activate');
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('preserves focusability when toggling between states', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Button>,
      );

      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);

      rerender(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(false);
      expect(getByRole('button').props.tabIndex).toBe(-1);

      rerender(
        <Button disabled focusableWhenDisabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);

      rerender(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);
    });
  });

  describe('Disabled with Multiple Interaction Sources', () => {
    it('ignores all interaction sources when disabled', () => {
      const onPressMock = jest.fn();
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          onPress={onPressMock}
          onKeyPress={onKeyPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Try press
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();

      // Try keyboard (onKeyPress callback still fires)
      fireKeyPress(button, 'Enter');
      expect(onPressMock).not.toHaveBeenCalled();

      // Try accessibility action
      fireAccessibilityAction(button, 'activate');
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('allows onKeyPress callback to fire even when disabled', () => {
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          onKeyPress={onKeyPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Tab');
      expect(onKeyPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Group Focus Management with Disabled', () => {
    it('assigns correct focusable and tabIndex across a mixed group of buttons', () => {
      const { getAllByRole } = render(
        <>
          <Button accessibilityHint='Normal button'>
            <Text>Normal</Text>
          </Button>
          <Button disabled accessibilityHint='Disabled button'>
            <Text>Disabled</Text>
          </Button>
          <Button
            disabled
            focusableWhenDisabled
            accessibilityHint='Loading button'
          >
            <Text>Loading</Text>
          </Button>
        </>,
      );

      const [normal, disabled, loading] = getAllByRole('button');

      expect(normal.props.focusable).toBe(true);
      expect(normal.props.tabIndex).toBe(0);
      expect(normal.props.accessibilityState.disabled).toBe(false);

      expect(disabled.props.focusable).toBe(false);
      expect(disabled.props.tabIndex).toBe(-1);
      expect(disabled.props.accessibilityState.disabled).toBe(true);

      expect(loading.props.focusable).toBe(true);
      expect(loading.props.tabIndex).toBe(0);
      expect(loading.props.accessibilityState.disabled).toBe(true);
    });

    it('updates tabIndex when a button transitions from enabled to disabled', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.tabIndex).toBe(0);
      expect(button.props.focusable).toBe(true);

      rerender(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Button</Text>
        </Button>,
      );

      const disabledButton = getByRole('button');
      expect(disabledButton.props.tabIndex).toBe(-1);
      expect(disabledButton.props.focusable).toBe(false);
    });

    it('preserves tabIndex=0 when transitioning to disabled with focusableWhenDisabled', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.tabIndex).toBe(0);

      rerender(
        <Button disabled focusableWhenDisabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Button</Text>
        </Button>,
      );

      const disabledButton = getByRole('button');
      expect(disabledButton.props.tabIndex).toBe(0);
      expect(disabledButton.props.focusable).toBe(true);
      expect(disabledButton.props.accessibilityState.disabled).toBe(true);
    });
  });
});
