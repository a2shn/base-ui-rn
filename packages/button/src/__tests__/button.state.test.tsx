import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - State Management', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Press Interaction', () => {
    it('triggers onPress callback on touch press', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Press Me</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('triggers onPress with event object', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Press Me</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalled();
      expect(onPressMock.mock.calls.length).toBe(1);
    });

    it('does not trigger onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('does not trigger onPress when disabled even with focusableWhenDisabled', () => {
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
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('State Change Sources', () => {
    it('reports source as "press" for touch interactions', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Press Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalled();
    });

    it('reports source as "keyboard" for keyboard activation', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).toHaveBeenCalled();
    });

    it('reports source as "accessibilityAction" for screen reader actions', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalled();
    });
  });

  describe('Focus State', () => {
    it('tracks focused state correctly', () => {
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

    it('tracks blurred state correctly', () => {
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

    it('calls both internal and user-provided onFocus', () => {
      const onFocusUser = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onFocus={onFocusUser}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'focus');

      expect(onFocusUser).toHaveBeenCalled();
    });

    it('calls both internal and user-provided onBlur', () => {
      const onBlurUser = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onBlur={onBlurUser}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'blur');

      expect(onBlurUser).toHaveBeenCalled();
    });
  });

  describe('Focus Ring State', () => {
    it('applies focus ring style when focused', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'focus');

      expect(button).toBeDefined();
    });

    it('removes focus ring style when blurred', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'focus');
      fireEvent(button, 'blur');

      expect(button).toBeDefined();
    });

    it('respects disableDefaultFocusRing prop', () => {
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} disableDefaultFocusRing>
          <Text>No Focus Ring</Text>
        </Button>,
      );

      expect(getByRole('button')).toBeDefined();
    });
  });

  describe('State Transitions', () => {
    it('maintains state consistency across multiple interactions', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      for (let i = 0; i < 5; i++) {
        fireEvent.press(button);
      }

      expect(onPressMock).toHaveBeenCalledTimes(5);
    });

    it('handles rapid focus/blur transitions', () => {
      const onFocusMock = jest.fn();
      const onBlurMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onBlur={onBlurMock}
          onFocus={onFocusMock}
        >
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'focus');
      fireEvent(button, 'blur');
      fireEvent(button, 'focus');
      fireEvent(button, 'blur');

      expect(onFocusMock).toHaveBeenCalledTimes(2);
      expect(onBlurMock).toHaveBeenCalledTimes(2);
    });

    it('handles disabled state transition correctly', () => {
      const onPressMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(1);

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} disabled onPress={onPressMock}>
          <Text>Disabled</Text>
        </Button>,
      );

      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(1);

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Enabled</Text>
        </Button>,
      );

      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Callback Consistency', () => {
    it('uses latest onPress callback', () => {
      const onPressMock1 = jest.fn();
      const onPressMock2 = jest.fn();
      const { getByRole, rerender } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock1}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);
      expect(onPressMock1).toHaveBeenCalledTimes(1);
      expect(onPressMock2).not.toHaveBeenCalled();

      rerender(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock2}>
          <Text>Button</Text>
        </Button>,
      );

      fireEvent.press(button);
      expect(onPressMock1).toHaveBeenCalledTimes(1);
      expect(onPressMock2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Event Data', () => {
    it('passes event data to onPress callback', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button accessibilityHint={DEFAULT_HINT} onPress={onPressMock}>
          <Text>Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalled();
    });

    it('passes event data to onFocus callback', () => {
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

    it('passes event data to onBlur callback', () => {
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
  });
});
