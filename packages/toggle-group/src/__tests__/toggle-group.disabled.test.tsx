import { Toggle } from '@base-ui-rn/toggle';
import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { ToggleGroup } from '../toggle-group';

describe('ToggleGroup - Disabled State', () => {
  it('disables all toggles when group is disabled', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup disabled onValueChange={onValueChange}>
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

    expect(a.props.accessibilityState.disabled).toBe(true);
    expect(b.props.accessibilityState.disabled).toBe(true);
    expect(a.props.focusable).toBe(false);
    expect(b.props.focusable).toBe(false);

    fireEvent.press(a);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('allows individual toggles to be disabled independently', () => {
    const onValueChange = jest.fn();
    const { getByRole } = render(
      <ToggleGroup onValueChange={onValueChange}>
        <Toggle disabled value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });
    const b = getByRole('checkbox', { name: 'B' });

    expect(a.props.accessibilityState.disabled).toBe(true);
    expect(b.props.accessibilityState.disabled).toBe(false);

    fireEvent.press(a);
    expect(onValueChange).not.toHaveBeenCalled();

    fireEvent.press(b);
    expect(onValueChange).toHaveBeenCalled();
  });

  it('respects focusableWhenDisabled on individual toggles even if group is disabled', () => {
    const { getByRole } = render(
      <ToggleGroup disabled>
        <Toggle focusableWhenDisabled value='a'>
          <Text>A</Text>
        </Toggle>
        <Toggle value='b'>
          <Text>B</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const a = getByRole('checkbox', { name: 'A' });
    const b = getByRole('checkbox', { name: 'B' });

    expect(a.props.accessibilityState.disabled).toBe(true);
    expect(a.props.focusable).toBe(true);

    expect(b.props.accessibilityState.disabled).toBe(true);
    expect(b.props.focusable).toBe(false);
  });
});
