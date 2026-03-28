import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';

import { Radio, RadioGroup } from '../index';

function renderGroup(
  groupProps?: Partial<React.ComponentProps<typeof RadioGroup>>,
) {
  const onValueChange = jest.fn();
  const result = render(
    <RadioGroup onValueChange={onValueChange} {...groupProps}>
      <Radio.Root aria-label='A' value='a' />
      <Radio.Root aria-label='B' value='b' />
      <Radio.Root aria-label='C' value='c' />
    </RadioGroup>,
  );
  return { ...result, onValueChange };
}

describe('Radio - State', () => {
  describe('Uncontrolled', () => {
    it('selects a radio on press (uncontrolled)', () => {
      const { getAllByRole } = renderGroup({ defaultValue: undefined });
      const [radioA] = getAllByRole('radio');

      expect(radioA.props.accessibilityState.checked).toBe(false);
      fireEvent.press(radioA);
      expect(radioA.props.accessibilityState.checked).toBe(true);
    });

    it('starts with defaultValue pre-selected', () => {
      const { getAllByRole } = renderGroup({ defaultValue: 'b' });
      const [radioA, radioB] = getAllByRole('radio');

      expect(radioA.props.accessibilityState.checked).toBe(false);
      expect(radioB.props.accessibilityState.checked).toBe(true);
    });

    it('moves selection between radios', () => {
      const { getAllByRole } = renderGroup({ defaultValue: 'a' });
      const [radioA, radioB] = getAllByRole('radio');

      expect(radioA.props.accessibilityState.checked).toBe(true);
      fireEvent.press(radioB);
      expect(radioA.props.accessibilityState.checked).toBe(false);
      expect(radioB.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('Controlled', () => {
    it('respects controlled value prop', () => {
      const onValueChange = jest.fn();
      const { getAllByRole, rerender } = render(
        <RadioGroup onValueChange={onValueChange} value='a'>
          <Radio.Root aria-label='A' value='a' />
          <Radio.Root aria-label='B' value='b' />
        </RadioGroup>,
      );
      const [radioA, radioB] = getAllByRole('radio');

      expect(radioA.props.accessibilityState.checked).toBe(true);
      expect(radioB.props.accessibilityState.checked).toBe(false);

      fireEvent.press(radioB);
      expect(onValueChange).toHaveBeenCalledWith('b');
      // State should not change until re-rendered with new prop
      expect(radioA.props.accessibilityState.checked).toBe(true);

      rerender(
        <RadioGroup onValueChange={onValueChange} value='b'>
          <Radio.Root aria-label='A' value='a' />
          <Radio.Root aria-label='B' value='b' />
        </RadioGroup>,
      );
      expect(radioA.props.accessibilityState.checked).toBe(false);
      expect(radioB.props.accessibilityState.checked).toBe(true);
    });
  });

  describe('Disabled', () => {
    it('does not fire onValueChange when group is disabled', () => {
      const { getAllByRole, onValueChange } = renderGroup({ disabled: true });
      const [radioA] = getAllByRole('radio');

      fireEvent.press(radioA);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('ReadOnly', () => {
    it('does not fire onValueChange when group is readOnly', () => {
      const { getAllByRole, onValueChange } = renderGroup({
        defaultValue: 'a',
        readOnly: true,
      });
      const [, radioB] = getAllByRole('radio');

      fireEvent.press(radioB);
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility action', () => {
    it('selects a radio through accessibilityAction activate', () => {
      const { getAllByRole, onValueChange } = renderGroup();
      const [radioA] = getAllByRole('radio');

      fireEvent(radioA, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
      expect(onValueChange).toHaveBeenCalledWith('a');
    });
  });
});
