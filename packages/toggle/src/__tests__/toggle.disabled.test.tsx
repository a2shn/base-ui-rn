import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Toggle } from '../toggle';

describe('Toggle - Disabled State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Disabled Behavior', () => {
    it('ignores presses and applies disabled accessibility state', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onChangeMock}
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
        <Toggle accessibilityHint={DEFAULT_HINT} disabled>
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
        <Toggle accessibilityHint={DEFAULT_HINT} disabled focusableWhenDisabled>
          <Text>Loading</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      expect(toggle.props.focusable).toBe(true);
      expect(toggle.props.tabIndex).toBe(0);
      expect(toggle.props.accessibilityState).toEqual({
        checked: false,
        disabled: true,
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
        <Toggle accessibilityHint={DEFAULT_HINT} disabled>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.focusable).toBe(false);
      expect(getByRole('checkbox').props.tabIndex).toBe(-1);

      rerender(
        <Toggle accessibilityHint={DEFAULT_HINT} disabled focusableWhenDisabled>
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
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPressedChange={onChangeMock}
        >
          <Text>Loading Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
      expect(onChangeMock).not.toHaveBeenCalled();
    });

    it('ignores all interaction sources when disabled', () => {
      const onChangeMock = jest.fn();
      const { getByRole } = render(
        <Toggle
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onChangeMock}
        >
          <Text>Disabled Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      // Try press
      fireEvent.press(toggle);
      expect(onChangeMock).not.toHaveBeenCalled();

      // Try keyboard
      fireEvent(toggle, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onChangeMock).not.toHaveBeenCalled();

      // Try accessibility action
      fireEvent(toggle, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
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
          <Toggle accessibilityHint='Disabled toggle' disabled>
            <Text>Disabled</Text>
          </Toggle>
          <Toggle
            accessibilityHint='Loading toggle'
            disabled
            focusableWhenDisabled
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
        <Toggle accessibilityHint={DEFAULT_HINT} disabled focusableWhenDisabled>
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
