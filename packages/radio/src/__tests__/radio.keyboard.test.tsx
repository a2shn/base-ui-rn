import { ACTIVATION_KEYS, NON_ACTIVATION_KEYS } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform } from 'react-native';

import { Radio, RadioGroup } from '../index';

function renderGroup(props?: Partial<React.ComponentProps<typeof RadioGroup>>) {
  const onValueChange = jest.fn();
  const result = render(
    <RadioGroup
      defaultValue={undefined}
      onValueChange={onValueChange}
      {...props}
    >
      <Radio.Root aria-label='A' value='a' />
      <Radio.Root aria-label='B' value='b' />
    </RadioGroup>,
  );
  return { ...result, onValueChange };
}

describe('Radio - Keyboard', () => {
  it.each(ACTIVATION_KEYS)(
    'selects an unchecked radio on activation key "%s"',
    (key) => {
      const { getAllByRole, onValueChange } = renderGroup();
      const [radioA] = getAllByRole('radio');

      fireEvent(radioA, 'keyDown', { nativeEvent: { key } });
      expect(onValueChange).toHaveBeenCalledWith('a');
    },
  );

  it.each(NON_ACTIVATION_KEYS)(
    'does not select on non-activation key "%s"',
    (key) => {
      const { getAllByRole, onValueChange } = renderGroup();
      const [radioA] = getAllByRole('radio');

      // Only check keys that are not arrow keys (those drive navigation)
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        fireEvent(radioA, 'keyDown', { nativeEvent: { key } });
        expect(onValueChange).not.toHaveBeenCalled();
      }
    },
  );

  it('does not select when disabled', () => {
    const { getAllByRole, onValueChange } = renderGroup({ disabled: true });
    const [radioA] = getAllByRole('radio');

    fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'Enter' } });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not select when readOnly', () => {
    const { getAllByRole, onValueChange } = renderGroup({ readOnly: true });
    const [radioA] = getAllByRole('radio');

    fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'Enter' } });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe('Web specific', () => {
    const originalPlatform = Platform.OS;

    beforeEach(() => {
      Platform.OS = 'web';
    });

    afterEach(() => {
      Platform.OS = originalPlatform;
    });

    it('prevents double activation on Enter (KeyDown + Press)', () => {
      jest.useFakeTimers();
      const { getAllByRole, onValueChange } = renderGroup();
      const [radioA] = getAllByRole('radio');

      // Sequence that happens on web: keyDown fires Enter, then browser fires click
      fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent.press(radioA);

      expect(onValueChange).toHaveBeenCalledTimes(1);
      expect(onValueChange).toHaveBeenCalledWith('a');

      jest.runAllTimers();
      jest.useRealTimers();
    });
  });
});
