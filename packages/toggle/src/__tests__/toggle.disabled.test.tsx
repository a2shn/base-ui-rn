import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Toggle } from '../toggle';
import {
  DEFAULT_HINT,
  fireKeyPress,
  fireAccessibilityAction,
} from '@base-ui-rn/test-utils';

describe('Toggle - Disabled State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Disabled Behavior', () => {
    it('ignores presses and applies disabled accessibility state', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onPressedChange={onChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityState.disabled).toBe(true);

      fireEvent.press(toggle);
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('makes toggle non-focusable when disabled', () => {
      const { getByRole } = render(
        <Toggle disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      expect(toggle.props.focusable).toBe(false);
      expect(toggle.props.tabIndex).toBe(-1);
    });
  });

  describe('focusableWhenDisabled', () => {
    it('keeps focusable and tabIndex when disabled', () => {
      const { getByRole } = render(
        <Toggle disabled focusableWhenDisabled accessibilityHint={DEFAULT_HINT}>
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
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );

      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(false);
      expect(getByRole('checkbox').props.tabIndex).toBe(-1);

      rerender(
        <Toggle disabled focusableWhenDisabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);
    });
  });

  describe('Disabled with Multiple Interaction Sources', () => {
    it('blocks accessibility actions when disabled even if focusable', () => {
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

      fireAccessibilityAction(toggle, 'activate');
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('ignores all interaction sources when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          disabled
          onPressedChange={onChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Try press
      fireEvent.press(toggle);
      expect(onChangeMock).not.toHaveBeenCalled();

      // Try keyboard
      fireKeyPress(toggle, 'Enter');
      expect(onChangeMock).not.toHaveBeenCalled();

      // Try accessibility action
      fireAccessibilityAction(toggle, 'activate');
      expect(onChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Group Focus Management with Disabled', () => {
    it('assigns correct focusable and tabIndex across a mixed group of toggles', () => {
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
      expect(normal.props.accessibilityState.disabled).toBe(false);

      expect(disabled.props.focusable).toBe(false);
      expect(disabled.props.tabIndex).toBe(-1);
      expect(disabled.props.accessibilityState.disabled).toBe(true);

      expect(loading.props.focusable).toBe(true);
      expect(loading.props.tabIndex).toBe(0);
      expect(loading.props.accessibilityState.disabled).toBe(true);
    });

    it('does not lose focusability when toggling between enabled and focusableWhenDisabled', () => {
      const { getByRole, rerender } = render(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );

      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled focusableWhenDisabled accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );

      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);
      expect(getByRole('checkbox').props.accessibilityState.disabled).toBe(
        true,
      );

      rerender(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle</Text>
        </Toggle>,
      );

      expect(getByRole('checkbox').props.focusable).toBe(true);
      expect(getByRole('checkbox').props.tabIndex).toBe(0);
      expect(getByRole('checkbox').props.accessibilityState.disabled).toBe(
        false,
      );
    });
  });
});
