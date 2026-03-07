import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';
import { DEFAULT_HINT, testAccessibility } from '@base-ui-rn/test-utils';

describe('Button - Accessibility', () => {
  it('has correct default accessibility traits', () => {
    const { getByRole } = render(
      <Button accessibilityHint={DEFAULT_HINT}>
        <Text>Click Me</Text>
      </Button>,
    );

    testAccessibility(getByRole('button'), {
      hint: DEFAULT_HINT,
      focusable: true,
      disabled: false,
      actions: ['activate'],
      importantForAccessibility: 'yes',
    });
  });

  it('supports custom accessibilityLabel and accessibilityHint', () => {
    const { getByRole } = render(
      <Button accessibilityLabel='Custom Label' accessibilityHint='Custom Hint'>
        <Text>Click Me</Text>
      </Button>,
    );

    testAccessibility(getByRole('button'), {
      label: 'Custom Label',
      hint: 'Custom Hint',
    });
  });

  it('applies disabled state correctly', () => {
    const { getByRole } = render(
      <Button disabled>
        <Text>Disabled</Text>
      </Button>,
    );

    testAccessibility(getByRole('button'), {
      disabled: true,
      focusable: false,
    });
  });

  it('merges custom accessibilityState', () => {
    const { getByRole } = render(
      <Button accessibilityState={{ busy: true, selected: true }}>
        <Text>States</Text>
      </Button>,
    );

    testAccessibility(getByRole('button'), {
      busy: true,
      selected: true,
    });
  });

  it('handles accessibility actions', () => {
    const onPress = jest.fn();
    const onAccessibilityAction = jest.fn();
    const { getByRole } = render(
      <Button
        onPress={onPress}
        onAccessibilityAction={onAccessibilityAction}
        accessibilityActions={[{ name: 'activate' }]}
      >
        <Text>Action</Text>
      </Button>,
    );

    const button = getByRole('button');
    fireEvent(button, 'accessibilityAction', {
      nativeEvent: { actionName: 'activate' },
    });

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onAccessibilityAction).toHaveBeenCalledTimes(1);
  });

  it('merges custom accessibilityActions', () => {
    const { getByRole } = render(
      <Button
        accessibilityActions={[{ name: 'longpress', label: 'Long Press' }]}
        onAccessibilityAction={() => {}}
      >
        <Text>Custom Actions</Text>
      </Button>,
    );

    testAccessibility(getByRole('button'), {
      actions: ['activate', 'longpress'],
    });
  });

  describe('Web Accessibility', () => {
    it('sets tabIndex based on disabled state', () => {
      const { getByRole, rerender } = render(
        <Button>
          <Text>A</Text>
        </Button>,
      );
      expect(getByRole('button').props.tabIndex).toBe(0);

      rerender(
        <Button disabled>
          <Text>A</Text>
        </Button>,
      );
      expect(getByRole('button').props.tabIndex).toBe(-1);
    });

    it('allows overriding tabIndex', () => {
      const { getByRole } = render(
        <Button tabIndex={-1}>
          <Text>A</Text>
        </Button>,
      );
      expect(getByRole('button').props.tabIndex).toBe(-1);
    });

    it('populates aria-keyshortcuts from shortcut prop', () => {
      const { getByRole } = render(
        <Button shortcut={{ keys: ['s'], modifiers: ['ctrl'] }}>
          <Text>Save</Text>
        </Button>,
      );
      expect(getByRole('button').props['aria-keyshortcuts']).toBe('Control+s');
    });

    it('handles multiple keys in aria-keyshortcuts', () => {
      const { getByRole } = render(
        <Button shortcut={{ keys: ['k', 'l'], modifiers: ['meta', 'shift'] }}>
          <Text>Multi</Text>
        </Button>,
      );
      expect(getByRole('button').props['aria-keyshortcuts']).toBe(
        'Meta+Shift+k Meta+Shift+l',
      );
    });
  });
});
