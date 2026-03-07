import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Toggle } from '../toggle';
import { DEFAULT_HINT, testAccessibility } from '@base-ui-rn/test-utils';

describe('Toggle - Accessibility', () => {
  it('has correct default accessibility traits', () => {
    const { getByRole } = render(
      <Toggle accessibilityHint={DEFAULT_HINT}>
        <Text>Toggle Me</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      hint: DEFAULT_HINT,
      focusable: true,
      disabled: false,
      checked: false,
      actions: ['activate'],
      importantForAccessibility: 'yes',
    });
  });

  it('renders as a switch when role is overridden', () => {
    const { getByRole } = render(
      <Toggle role='switch' accessibilityHint={DEFAULT_HINT}>
        <Text>Toggle Me</Text>
      </Toggle>,
    );

    expect(getByRole('switch')).toBeDefined();
  });

  it('supports custom accessibilityLabel and accessibilityHint', () => {
    const { getByRole } = render(
      <Toggle accessibilityLabel='Custom Label' accessibilityHint='Custom Hint'>
        <Text>Toggle Me</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      label: 'Custom Label',
      hint: 'Custom Hint',
    });
  });

  it('applies pressed state correctly', () => {
    const { getByRole } = render(
      <Toggle pressed>
        <Text>Pressed</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      checked: true,
    });
  });

  it('applies disabled state correctly', () => {
    const { getByRole } = render(
      <Toggle disabled>
        <Text>Disabled</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      disabled: true,
      focusable: false,
    });
  });

  it('merges custom accessibilityState', () => {
    const { getByRole } = render(
      <Toggle accessibilityState={{ busy: true, selected: true }}>
        <Text>States</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      busy: true,
      selected: true,
    });
  });

  it('handles accessibility actions', () => {
    const onPressedChange = jest.fn();
    const onAccessibilityAction = jest.fn();
    const { getByRole } = render(
      <Toggle
        onPressedChange={onPressedChange}
        onAccessibilityAction={onAccessibilityAction}
        accessibilityActions={[{ name: 'activate' }]}
      >
        <Text>Action</Text>
      </Toggle>,
    );

    const toggle = getByRole('checkbox');
    fireEvent(toggle, 'accessibilityAction', {
      nativeEvent: { actionName: 'activate' },
    });

    expect(onPressedChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ source: 'accessibilityAction' }),
    );
    expect(onAccessibilityAction).toHaveBeenCalledTimes(1);
  });

  it('merges custom accessibilityActions', () => {
    const { getByRole } = render(
      <Toggle
        accessibilityActions={[{ name: 'magicTap', label: 'Magic' }]}
        onAccessibilityAction={() => {}}
      >
        <Text>Custom Actions</Text>
      </Toggle>,
    );

    testAccessibility(getByRole('checkbox'), {
      actions: ['activate', 'magicTap'],
    });
  });

  describe('Web Accessibility', () => {
    it('sets tabIndex based on disabled state', () => {
      const { getByRole, rerender } = render(
        <Toggle>
          <Text>A</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.tabIndex).toBe(0);

      rerender(
        <Toggle disabled>
          <Text>A</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props.tabIndex).toBe(-1);
    });

    it('reflects pressed state for aria-pressed and data-pressed', () => {
      const { getByRole, rerender } = render(
        <Toggle pressed>
          <Text>A</Text>
        </Toggle>,
      );
      const toggle = getByRole('checkbox');
      expect(toggle.props['aria-pressed']).toBe(true);
      expect(toggle.props['data-pressed']).toBe(true);

      rerender(
        <Toggle pressed={false}>
          <Text>A</Text>
        </Toggle>,
      );
      expect(toggle.props['aria-pressed']).toBe(false);
      expect(toggle.props['data-pressed']).toBe(false);
    });

    it('populates aria-keyshortcuts from shortcut prop', () => {
      const { getByRole } = render(
        <Toggle shortcut={{ keys: ['t'], modifiers: ['alt'] }}>
          <Text>Toggle</Text>
        </Toggle>,
      );
      expect(getByRole('checkbox').props['aria-keyshortcuts']).toBe('Alt+t');
    });
  });
});
