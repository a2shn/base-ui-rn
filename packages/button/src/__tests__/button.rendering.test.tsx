import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';
import { DEFAULT_HINT } from '@base-ui-rn/test-utils';

describe('Button - Rendering & Accessibility', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Rendering', () => {
    it('renders as a Pressable by default with base accessibility', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Click Me</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button).toBeDefined();
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityHint).toBe(DEFAULT_HINT);
      expect(button.props.focusable).toBe(true);
      expect(button.props.accessibilityState).toEqual({ disabled: false });
      expect(button.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });

    it('defaults accessibilityHint when none is provided', () => {
      const { getByRole } = render(
        <Button>
          <Text>Default Hint</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.accessibilityHint).toBe('Activates the button');
    });

    it('applies disabled state correctly across all accessibility layers', () => {
      const { getByRole } = render(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(false);
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('Web Accessibility Props', () => {
    it('sets default tabIndex based on focusability', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Focusable</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.tabIndex).toBe(0);

      rerender(
        <Button disabled accessibilityHint={DEFAULT_HINT}>
          <Text>Not Focusable</Text>
        </Button>,
      );

      const disabledButton = getByRole('button');
      expect(disabledButton.props.tabIndex).toBe(-1);
    });

    it('allows overriding tabIndex and aria-disabled', () => {
      const webOverrides = {
        tabIndex: -1 as const,
        'aria-disabled': false,
      };

      const { getByRole } = render(
        <Button disabled accessibilityHint={DEFAULT_HINT} {...webOverrides}>
          <Text>Overrides</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.tabIndex).toBe(-1);
      expect(button.props['aria-disabled']).toBeUndefined();
    });
  });

  describe('Accessibility Actions', () => {
    it('adds activate accessibility action by default', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Actions</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });

    it('triggers onPress when activate accessibility action is fired', () => {
      const onPressMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();

      const { getByRole } = render(
        <Button
          onPress={onPressMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityActions={[{ name: 'activate' }]}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });

    it('ignores accessibility actions when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={DEFAULT_HINT}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Render Props', () => {
    it('supports React Native press state via render props', () => {
      const { getByText } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          {({ pressed }) => (
            <Text>{pressed ? 'Pressed State' : 'Normal State'}</Text>
          )}
        </Button>,
      );

      expect(getByText('Normal State')).toBeDefined();
    });
  });
});
