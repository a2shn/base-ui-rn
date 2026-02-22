import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Toggle } from '../toggle';
import { DEFAULT_HINT } from '@base-ui-rn/test-utils';

describe('Toggle - Rendering & Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Rendering & Roles', () => {
    it('renders as a checkbox by default', () => {
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Me</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle).toBeDefined();
      expect(toggle.props.accessibilityHint).toBe(DEFAULT_HINT);
      expect(toggle.props.accessibilityState).toEqual({
        disabled: false,
        checked: false,
      });
    });

    it('renders as a switch when role is overridden', () => {
      const { getByRole } = render(
        <Toggle role='switch' accessibilityHint={DEFAULT_HINT}>
          <Text>Toggle Me</Text>
        </Toggle>,
      );

      const toggle = getByRole('switch');
      expect(toggle).toBeDefined();
    });
  });

  describe('Accessibility Defaults', () => {
    it('defaults accessibilityHint when none is provided', () => {
      const { getByRole } = render(
        <Toggle>
          <Text>Default Hint</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityHint).toBe('Toggles the state');
    });

    it('adds activate accessibility action by default', () => {
      const { getByRole } = render(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Actions</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });
  });

  describe('Web Accessibility Props', () => {
    it('sets focusability and tabIndex based on disabled state', () => {
      const { getByRole, rerender } = render(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          <Text>Focusable</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.focusable).toBe(true);
      expect(toggle.props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Not Focusable</Text>
        </Toggle>,
      );

      const disabledToggle = getByRole('checkbox');
      expect(disabledToggle.props.focusable).toBe(false);
      expect(disabledToggle.props.tabIndex).toBe(-1);
    });

    it('supports overriding tabIndex and aria-disabled on web', () => {
      const webOverrides: { tabIndex: -1; 'aria-disabled'?: boolean } = {
        tabIndex: -1 as const,
        'aria-disabled': false,
      };

      const { getByRole } = render(
        <Toggle disabled accessibilityHint={DEFAULT_HINT} {...webOverrides}>
          <Text>Overrides</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props.tabIndex).toBe(-1);
      expect(toggle.props['aria-disabled']).toBeUndefined();
    });

    it('reflects pressed state for aria-pressed and data-pressed', () => {
      const { getByRole, rerender } = render(
        <Toggle pressed accessibilityHint={DEFAULT_HINT}>
          <Text>Pressed</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');
      expect(toggle.props['aria-pressed']).toBe(true);
      expect(toggle.props['data-pressed']).toBe(true);

      rerender(
        <Toggle pressed={false} accessibilityHint={DEFAULT_HINT}>
          <Text>Not Pressed</Text>
        </Toggle>,
      );

      const unpressed = getByRole('checkbox');
      expect(unpressed.props['aria-pressed']).toBe(false);
      expect(unpressed.props['data-pressed']).toBe(false);
    });
  });

  describe('Accessibility Actions', () => {
    it('triggers onPressedChange when activate accessibility action is fired', () => {
      const onPressedChangeMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();

      const { getByRole } = render(
        //eslint-disable-next-line react-native-a11y/has-valid-accessibility-actions
        <Toggle
          onPressedChange={onPressedChangeMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Action Toggle</Text>
        </Toggle>,
      );

      const toggle = getByRole('checkbox');

      fireEvent(toggle, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressedChangeMock).toHaveBeenCalledWith(true, {
        source: 'accessibilityAction',
      });
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Render Props', () => {
    it('provides pressed state to children as a function', () => {
      const { getByText } = render(
        <Toggle accessibilityHint={DEFAULT_HINT}>
          {({ pressed }) => (
            <Text>{pressed ? 'Is Pressed' : 'Not Pressed'}</Text>
          )}
        </Toggle>,
      );

      expect(getByText('Not Pressed')).toBeDefined();
    });
  });
});
