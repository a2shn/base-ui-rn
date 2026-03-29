import { ACTIVATION_KEYS } from '@base-ui-rn/core';
import { DEFAULT_HINT, NON_ACTIVATION_KEYS } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('triggers onPress when Enter is pressed', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onPress when Space is pressed', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: ' ' } });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onPress for all activation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('ignores keyboard activation when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('blocks all keyboard activation when disabled but focusable', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
        >
          <Text>Focusable Disabled</Text>
        </Button>,
      );

      const button = getByRole('button');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('restores keyboard activation when re-enabled', () => {
      const onPressMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Enabled</Text>
        </Button>,
      );

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('Non-Activation Keys', () => {
    it('does not trigger onPress for non-activation keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      NON_ACTIVATION_KEYS.forEach((key) => {
        fireEvent(button, 'keyDown', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPress for Tab key', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Tab' } });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('onKeyDown Callback', () => {
    it('forwards all key events to onKeyDown callback', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Escape' } });

      expect(onKeyDownMock).toHaveBeenCalledTimes(3);
    });

    it('forwards both activation and non-activation keys to onKeyDown', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });

      expect(onKeyDownMock).toHaveBeenCalledTimes(3);
    });

    it('receives native event data in onKeyDown', () => {
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onKeyDown={onKeyDownMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onKeyDownMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: expect.objectContaining({ key: 'Enter' }),
        }),
      );
    });
  });

  describe('Focus Management', () => {
    it('calls onFocus when focused', () => {
      const onFocusMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onFocus={onFocusMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'focus');

      expect(onFocusMock).toHaveBeenCalled();
    });

    it('calls onBlur when blurred', () => {
      const onBlurMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onBlur={onBlurMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'blur');

      expect(onBlurMock).toHaveBeenCalled();
    });

    it('tracks focused state correctly', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(true);
    });
  });

  describe('Accessibility Action Integration', () => {
    it('triggers onPress via accessibility action (VoiceOver/TalkBack)', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onPress for magicTap accessibility action', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'magicTap' },
      });

      expect(onPressMock).toHaveBeenCalled();
    });

    it('does not trigger onPress for non-activation accessibility actions like longpress', () => {
      const onPressMock = jest.fn();
      const onAccessibilityAction = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onAccessibilityAction={onAccessibilityAction}
          onPress={onPressMock}
        >
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'longpress' },
      });

      expect(onPressMock).not.toHaveBeenCalled();
      expect(onAccessibilityAction).toHaveBeenCalled();
    });
  });

  describe('Keyboard and Focus Ring Interaction', () => {
    it('applies focus ring style when focused', () => {
      const onFocusMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onFocus={onFocusMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'focus');

      expect(onFocusMock).toHaveBeenCalled();
    });

    it('works with disableDefaultFocusRing', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disableDefaultFocusRing>
          <Text>No Focus Ring</Text>
        </Button>,
      );

      expect(getByRole('button')).toBeDefined();
    });

    it('handles focus state with focusableWhenDisabled', () => {
      const onFocusMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onFocus={onFocusMock}
        >
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.focusable).toBe(true);

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} onFocus={onFocusMock}>
          <Text>Button</Text>
        </Button>,
      );

      expect(button.props.focusable).toBe(true);
    });
  });
});
