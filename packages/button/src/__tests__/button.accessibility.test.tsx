import { DEFAULT_HINT, testAccessibility } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - Accessibility', () => {
  describe('Default Accessibility', () => {
    it('has correct default accessibility role', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Click Me</Text>
        </Button>,
      );

      expect(getByRole('button')).toBeDefined();
    });

    it('has correct default accessibility traits', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Button</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        actions: ['activate'],
        disabled: false,
        focusable: true,
        hint: DEFAULT_HINT,
        importantForAccessibility: 'yes',
      });
    });
  });

  describe('Accessibility Label and Hint', () => {
    it('supports custom accessibilityLabel', () => {
      const { getByRole } = render(
        <Button accessibilityLabel='Custom Label'>
          <Text>Label Button</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        label: 'Custom Label',
      });
    });

    it('supports custom accessibilityHint', () => {
      const { getByRole } = render(
        <Button accessibilityHint='Custom Hint'>
          <Text>Hint Button</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        hint: 'Custom Hint',
      });
    });

    it('supports both accessibilityLabel and accessibilityHint', () => {
      const { getByRole } = render(
        <Button accessibilityHint='Hint' accessibilityLabel='Label'>
          <Text>Both</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        hint: 'Hint',
        label: 'Label',
      });
    });
  });

  describe('Disabled State', () => {
    it('applies disabled state correctly', () => {
      const { getByRole } = render(
        <Button disabled>
          <Text>Disabled Button</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        disabled: true,
        focusable: false,
      });
    });

    it('respects focusableWhenDisabled prop', () => {
      const { getByRole } = render(
        <Button disabled focusableWhenDisabled>
          <Text>Focusable Disabled</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        disabled: true,
        focusable: true,
      });
    });

    it('does not respond to accessibility actions when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock}>
          <Text>Disabled Action</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility State Merging', () => {
    it('merges custom accessibilityState with disabled', () => {
      const { getByRole } = render(
        <Button accessibilityState={{ selected: true }}>
          <Text>States</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        selected: true,
      });
    });

    it('merges custom accessibilityActions', () => {
      const { getByRole } = render(
        <Button accessibilityActions={[{ label: 'Magic', name: 'magicTap' }]}>
          <Text>Custom Actions</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        actions: ['activate', 'magicTap'],
      });
    });

    it('handles accessibility actions', () => {
      const onPressMock = jest.fn();
      const onAccessibilityAction = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityActions={[{ name: 'activate' }]}
          onAccessibilityAction={onAccessibilityAction}
          onPress={onPressMock}
        >
          <Text>Action</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalled();
      expect(onAccessibilityAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Web Accessibility (tabIndex)', () => {
    it('sets tabIndex to 0 when enabled', () => {
      const { getByRole, rerender } = render(
        <Button>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.tabIndex).toBe(0);

      rerender(
        <Button disabled>
          <Text>Disabled</Text>
        </Button>,
      );
      expect(getByRole('button').props.tabIndex).toBe(-1);
    });
  });

  describe('Focus Ring Props', () => {
    it('respects disableDefaultFocusRing prop', () => {
      const { getByRole } = render(
        <Button disableDefaultFocusRing>
          <Text>No Focus Ring</Text>
        </Button>,
      );

      expect(getByRole('button')).toBeDefined();
    });

    it('renders with focusable prop based on disabled state', () => {
      const { getByRole, rerender } = render(
        <Button>
          <Text>Button</Text>
        </Button>,
      );

      expect(getByRole('button').props.focusable).toBe(true);

      rerender(
        <Button disabled>
          <Text>Disabled</Text>
        </Button>,
      );

      expect(getByRole('button').props.focusable).toBe(false);

      rerender(
        <Button disabled focusableWhenDisabled>
          <Text>Focusable Disabled</Text>
        </Button>,
      );

      expect(getByRole('button').props.focusable).toBe(true);
    });
  });

  describe('Important For Accessibility', () => {
    it('has importantForAccessibility set to yes by default', () => {
      const { getByRole } = render(
        <Button>
          <Text>Button</Text>
        </Button>,
      );

      testAccessibility(getByRole('button'), {
        importantForAccessibility: 'yes',
      });
    });
  });

  describe('Native Props Passthrough', () => {
    it('passes through hitSlop prop', () => {
      const { getByRole } = render(
        <Button hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}>
          <Text>Hit Slop</Text>
        </Button>,
      );

      expect(getByRole('button').props.hitSlop).toEqual({
        bottom: 10,
        left: 10,
        right: 10,
        top: 10,
      });
    });

    it('passes through testID prop', () => {
      const { getByTestId } = render(
        <Button testID='button-test'>
          <Text>Test ID</Text>
        </Button>,
      );

      expect(getByTestId('button-test')).toBeDefined();
    });
  });
});
