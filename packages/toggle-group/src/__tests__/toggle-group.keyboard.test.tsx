import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';
import {
  fireKeyPress,
  ACTIVATION_KEYS,
  NON_ACTIVATION_KEYS,
} from '@base-ui-rn/test-utils';

describe('ToggleGroup - Keyboard Interaction', () => {
  it('allows activating toggles via ALL hardware activation keys (Enter, Space, Gamepad buttons)', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup onValueChange={onValueChange}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });

    ACTIVATION_KEYS.forEach((key, index) => {
      fireKeyPress(a, key);
      // Even index = toggled ON (['a']), Odd index = toggled OFF ([])
      const expectedValue = index % 2 === 0 ? ['a'] : [];
      expect(onValueChange).toHaveBeenLastCalledWith(
        expectedValue,
        expect.objectContaining({
          source: 'keyboard',
          value: 'a',
        }),
      );
    });

    expect(onValueChange).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
  });

  it('ignores non-activation keys (Tab, Arrows, etc.)', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup onValueChange={onValueChange}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });

    NON_ACTIVATION_KEYS.forEach((key) => {
      fireKeyPress(a, key);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('blocks ALL hardware activation keys when group is disabled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup disabled onValueChange={onValueChange}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });

    ACTIVATION_KEYS.forEach((key) => {
      fireKeyPress(a, key);
    });

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('handles multiple toggles with mixed hardware activation', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup onValueChange={onValueChange} multiple>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });
    const b = getByRole('checkbox', { name: 'B' });

    // Activate 'a' with 'Enter'
    fireKeyPress(a, 'Enter');
    expect(onValueChange).toHaveBeenLastCalledWith(['a'], expect.anything());

    // Activate 'b' with 'Select' (gamepad)
    fireKeyPress(b, 'Select');
    expect(onValueChange).toHaveBeenLastCalledWith(
      ['a', 'b'],
      expect.anything(),
    );
  });
});
