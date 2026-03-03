import * as React from 'react';
import { Text } from 'react-native';
import { render, act } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';
import { fireKeyPress } from '@base-ui-rn/test-utils';

describe('ToggleGroup - Keyboard Navigation', () => {
  it('navigates through toggles using arrow keys in horizontal orientation', async () => {
    const onFocusChange = jest.fn();
    const { getByText } = render(
      <ToggleGroup orientation='horizontal' onFocusChange={onFocusChange}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
        <Toggle value='c'>
          <Text>C</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByText('A');
    const b = getByText('B');
    const c = getByText('C');

    // From A, press Right -> Focus B
    await act(async () => {
      fireKeyPress(a, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledWith('b');

    // From B, press Right -> Focus C
    await act(async () => {
      fireKeyPress(b, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledWith('c');

    // From C, press Right -> Focus A (loopFocus defaults to true)
    await act(async () => {
      fireKeyPress(c, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledWith('a');

    // From A, press Left -> Focus C
    await act(async () => {
      fireKeyPress(a, 'ArrowLeft');
    });
    expect(onFocusChange).toHaveBeenLastCalledWith('c');
  });

  it('navigates through toggles using arrow keys in vertical orientation', async () => {
    const onFocusChange = jest.fn();
    const { getByText } = render(
      <ToggleGroup orientation='vertical' onFocusChange={onFocusChange}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByText('A');
    const b = getByText('B');

    // From A, press Down -> Focus B
    await act(async () => {
      fireKeyPress(a, 'ArrowDown');
    });
    expect(onFocusChange).toHaveBeenCalledWith('b');

    // Horizontal keys should be ignored in vertical orientation
    await act(async () => {
      fireKeyPress(a, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledTimes(1); // Still only 'b' from before

    // Back to A
    await act(async () => {
      fireKeyPress(b, 'ArrowUp');
    });
    expect(onFocusChange).toHaveBeenLastCalledWith('a');
  });

  it('respects loopFocus={false}', async () => {
    const onFocusChange = jest.fn();
    const { getByText } = render(
      <ToggleGroup
        orientation='horizontal'
        loopFocus={false}
        onFocusChange={onFocusChange}
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const b = getByText('B');
    const a = getByText('A');

    // Focus B
    await act(async () => {
      fireKeyPress(a, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledWith('b');

    // From B, press Right -> Should NOT loop to A
    await act(async () => {
      fireKeyPress(b, 'ArrowRight');
    });
    expect(onFocusChange).toHaveBeenCalledTimes(1);
  });

  it('ignores arrow keys when disabled', async () => {
    const onFocusChange = jest.fn();
    const { getByText } = render(
      <ToggleGroup
        orientation='horizontal'
        disabled
        onFocusChange={onFocusChange}
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByText('A');

    await act(async () => {
      fireKeyPress(a, 'ArrowRight');
    });
    expect(onFocusChange).not.toHaveBeenCalled();
  });
});
