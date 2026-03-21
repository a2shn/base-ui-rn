import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - Disabled State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Disabled Behavior', () => {
    it('ignores presses when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('applies disabled accessibility state', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.accessibilityState).toEqual({ disabled: true });
      expect(button.props.focusable).toBe(false);
    });

    it('makes button non-focusable when disabled', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled>
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
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
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
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
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
        <Button accessibilityHint={DEFAULT_HINT} disabled>
          <Text>Toggle</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(false);
      expect(getByRole('button').props.tabIndex).toBe(-1);

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} disabled focusableWhenDisabled>
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
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          onKeyDown={onKeyDownMock}
          onPress={onPressMock}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Try press
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();

      // Try keyboard (onKeyDown callback still fires)
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();

      // Try accessibility action
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Group Focus Management with Disabled', () => {
    it('assigns correct focusable and tabIndex across a mixed group of buttons', () => {
      const { getAllByRole } = render(
        <>
          <Button accessibilityHint='Normal button'>
            <Text>Normal</Text>
          </Button>
          <Button accessibilityHint='Disabled button' disabled>
            <Text>Disabled</Text>
          </Button>
          <Button
            accessibilityHint='Loading button'
            disabled
            focusableWhenDisabled
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
        <Button accessibilityHint={DEFAULT_HINT} disabled>
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
        <Button accessibilityHint={DEFAULT_HINT} disabled focusableWhenDisabled>
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
