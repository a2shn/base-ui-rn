import * as React from 'react';
import { Platform } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { SwitchRoot } from '../index';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('Switch - Keyboard', () => {
  it('toggles on Enter key press', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'Enter');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Space key press', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot defaultChecked={true} onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, ' ');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('does not toggle on other keys', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'a');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByRole } = render(
      <SwitchRoot disabled onCheckedChange={onCheckedChange} />,
    );
    const root = getByRole('switch');

    fireKeyPress(root, 'Enter');
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  describe('Web specific', () => {
    const originalPlatform = Platform.OS;

    beforeEach(() => {
      Platform.OS = 'web';
    });

    afterEach(() => {
      // @ts-expect-error - readonly property
      Platform.OS = originalPlatform;
    });

    it('prevents double activation on Enter (KeyPress + Press)', () => {
      jest.useFakeTimers();
      const onCheckedChange = jest.fn();
      const { getByRole } = render(
        <SwitchRoot defaultChecked={false} onCheckedChange={onCheckedChange} />,
      );
      const root = getByRole('switch');

      // Simulate the sequence that happens on web:
      // 1. Hardware keydown (handled by our onKeyPress)
      fireKeyPress(root, 'Enter');
      // 2. Browser click event (handled by Pressable's onPress)
      fireEvent.press(root);

      expect(onCheckedChange).toHaveBeenCalledTimes(1);
      expect(onCheckedChange).toHaveBeenCalledWith(true);

      // After timeout, it should be enabled again for real presses
      jest.runAllTimers();
      fireEvent.press(root);
      expect(onCheckedChange).toHaveBeenCalledTimes(2);
      expect(onCheckedChange).toHaveBeenCalledWith(false);

      jest.useRealTimers();
    });
  });
});
