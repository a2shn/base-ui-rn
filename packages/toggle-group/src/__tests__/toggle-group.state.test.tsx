import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';

describe('ToggleGroup - State Management', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled Value', () => {
    it('manages its own state when defaultValue is provided', () => {
      const { getByRole } = render(
        <ToggleGroup defaultValue={['a']}>
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

      expect(a.props.accessibilityState.checked).toBe(true);
      expect(b.props.accessibilityState.checked).toBe(false);

      fireEvent.press(b);

      expect(a.props.accessibilityState.checked).toBe(false);
      expect(b.props.accessibilityState.checked).toBe(true);
    });

    it('defaults to an empty array when no defaultValue is provided', () => {
      const { getByRole } = render(
        <ToggleGroup>
          <Toggle value='a'>
            <Text>A</Text>
          </Toggle>
        </ToggleGroup>,
      );
      expect(
        getByRole('checkbox', { name: 'A' }).props.accessibilityState.checked,
      ).toBe(false);
    });
  });

  describe('Controlled Value', () => {
    it('follows the controlled value prop', () => {
      const { getByRole, rerender } = render(
        <ToggleGroup value={['a']}>
          <Toggle value='a'>
            <Text>A</Text>
          </Toggle>
          <Toggle value='b'>
            <Text>B</Text>
          </Toggle>
        </ToggleGroup>,
      );

      expect(
        getByRole('checkbox', { name: 'A' }).props.accessibilityState.checked,
      ).toBe(true);
      expect(
        getByRole('checkbox', { name: 'B' }).props.accessibilityState.checked,
      ).toBe(false);

      rerender(
        <ToggleGroup value={['b']}>
          <Toggle value='a'>
            <Text>A</Text>
          </Toggle>
          <Toggle value='b'>
            <Text>B</Text>
          </Toggle>
        </ToggleGroup>,
      );

      expect(
        getByRole('checkbox', { name: 'A' }).props.accessibilityState.checked,
      ).toBe(false);
      expect(
        getByRole('checkbox', { name: 'B' }).props.accessibilityState.checked,
      ).toBe(true);
    });

    it('calls onValueChange when a toggle is pressed', () => {
      const onValueChange = jest.fn();
      const { getByRole } = render(
        <ToggleGroup value={['a']} onValueChange={onValueChange}>
          <Toggle value='a'>
            <Text>A</Text>
          </Toggle>
          <Toggle value='b'>
            <Text>B</Text>
          </Toggle>
        </ToggleGroup>,
      );

      fireEvent.press(getByRole('checkbox', { name: 'B' }));

      expect(onValueChange).toHaveBeenCalledWith(
        ['b'],
        expect.objectContaining({
          source: 'press',
          value: 'b',
        }),
      );
    });
  });

  describe('Single Selection (multiple=false)', () => {
    it('allows only one item to be selected at a time', () => {
      const { getByRole } = render(
        <ToggleGroup>
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

      fireEvent.press(a);
      expect(a.props.accessibilityState.checked).toBe(true);

      fireEvent.press(b);
      expect(a.props.accessibilityState.checked).toBe(false);
      expect(b.props.accessibilityState.checked).toBe(true);
    });

    it('allows deselecting the active item', () => {
      const { getByRole } = render(
        <ToggleGroup defaultValue={['a']}>
          <Toggle value='a'>
            <Text>A</Text>
          </Toggle>
        </ToggleGroup>,
      );

      const a = getByRole('checkbox', { name: 'A' });
      fireEvent.press(a);
      expect(a.props.accessibilityState.checked).toBe(false);
    });
  });

  describe('Multiple Selection (multiple=true)', () => {
    it('allows multiple items to be selected', () => {
      const { getByRole } = render(
        <ToggleGroup multiple>
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

      fireEvent.press(a);
      fireEvent.press(b);

      expect(a.props.accessibilityState.checked).toBe(true);
      expect(b.props.accessibilityState.checked).toBe(true);

      fireEvent.press(a);
      expect(a.props.accessibilityState.checked).toBe(false);
      expect(b.props.accessibilityState.checked).toBe(true);
    });
  });
});
