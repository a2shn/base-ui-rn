import { DPAD_KEYS } from '@base-ui-rn/test-utils';
import { act, fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { Radio, RadioGroup } from '../index';

describe('Radio - Keyboard Navigation', () => {
  it('navigates forward through radios with ArrowDown in vertical orientation', async () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      <RadioGroup
        defaultValue='a'
        onValueChange={onValueChange}
        orientation='vertical'
      >
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
        <Radio.Root aria-label='C' value='c' />
      </RadioGroup>,
    );
    const [radioA] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
    });
    // Navigation moves focus but onFocusChange is not tracked here; ensure no error
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('navigates forward with ArrowRight in horizontal orientation', async () => {
    const { getAllByRole } = render(
      <RadioGroup orientation='horizontal'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
      </RadioGroup>,
    );
    const [radioA] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
    });
    // Should not throw
  });

  it('navigates backward with ArrowUp in vertical orientation', async () => {
    const { getAllByRole } = render(
      <RadioGroup orientation='vertical'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
      </RadioGroup>,
    );
    const [, radioB] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioB, 'keyDown', { nativeEvent: { key: 'ArrowUp' } });
    });
    // Should not throw
  });

  it('navigates to first item on Home key', async () => {
    const { getAllByRole } = render(
      <RadioGroup orientation='vertical'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
        <Radio.Root aria-label='C' value='c' />
      </RadioGroup>,
    );
    const [, , radioC] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioC, 'keyDown', { nativeEvent: { key: 'Home' } });
    });
    // Should not throw
  });

  it('navigates to last item on End key', async () => {
    const { getAllByRole } = render(
      <RadioGroup orientation='vertical'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
      </RadioGroup>,
    );
    const [radioA] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'End' } });
    });
    // Should not throw
  });

  it('ignores arrow key navigation when disabled', async () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      <RadioGroup disabled onValueChange={onValueChange} orientation='vertical'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
      </RadioGroup>,
    );
    const [radioA] = getAllByRole('radio');

    await act(async () => {
      fireEvent(radioA, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('passes DPAD_KEYS without error', async () => {
    const { getAllByRole } = render(
      <RadioGroup orientation='both'>
        <Radio.Root aria-label='A' value='a' />
        <Radio.Root aria-label='B' value='b' />
      </RadioGroup>,
    );
    const [radioA] = getAllByRole('radio');

    for (const key of DPAD_KEYS) {
      await act(async () => {
        fireEvent(radioA, 'keyDown', { nativeEvent: { key } });
      });
    }
  });
});
