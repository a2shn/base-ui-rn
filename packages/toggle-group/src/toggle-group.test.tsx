import { Toggle } from '@base-ui-rn/toggle';
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { ToggleGroup } from './index';

describe('ToggleGroup Primitive (Integration)', () => {
  describe('Basic Rendering & Single Selection (Uncontrolled)', () => {
    it('allows selecting and deselecting a single value', () => {
      const onValueChangeMock = jest.fn();
      render(
        <ToggleGroup onValueChange={onValueChangeMock} testID='group-single'>
          <Toggle testID='toggle-a' value='a'>
            {({ pressed }) => <Text>{pressed ? 'A-ON' : 'A-OFF'}</Text>}
          </Toggle>
          <Toggle testID='toggle-b' value='b'>
            {({ pressed }) => <Text>{pressed ? 'B-ON' : 'B-OFF'}</Text>}
          </Toggle>
        </ToggleGroup>,
      );

      const group = screen.getByTestId('group-single');
      const toggleA = screen.getByTestId('toggle-a');
      const toggleB = screen.getByTestId('toggle-b');

      expect(group.props.role).toBe('radiogroup');
      expect(screen.getByText('A-OFF')).toBeTruthy();
      expect(screen.getByText('B-OFF')).toBeTruthy();

      fireEvent.press(toggleA);
      expect(screen.getByText('A-ON')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith(['a']);

      fireEvent.press(toggleB);
      expect(screen.getByText('A-OFF')).toBeTruthy();
      expect(screen.getByText('B-ON')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith(['b']);

      fireEvent.press(toggleB);
      expect(screen.getByText('B-OFF')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith([]);
    });

    it('respects defaultValue', () => {
      render(
        <ToggleGroup defaultValue={['b']}>
          <Toggle testID='toggle-a' value='a'>
            {({ pressed }) => <Text>{pressed ? 'A-ON' : 'A-OFF'}</Text>}
          </Toggle>
          <Toggle testID='toggle-b' value='b'>
            {({ pressed }) => <Text>{pressed ? 'B-ON' : 'B-OFF'}</Text>}
          </Toggle>
        </ToggleGroup>,
      );

      expect(screen.getByText('A-OFF')).toBeTruthy();
      expect(screen.getByText('B-ON')).toBeTruthy();
    });
  });

  describe('Multiple Selection (Uncontrolled)', () => {
    it('allows selecting multiple values concurrently', () => {
      const onValueChangeMock = jest.fn();
      render(
        <ToggleGroup
          multiple
          onValueChange={onValueChangeMock}
          testID='group-multi'
        >
          <Toggle testID='toggle-a' value='a'>
            {({ pressed }) => <Text>{pressed ? 'A-ON' : 'A-OFF'}</Text>}
          </Toggle>
          <Toggle testID='toggle-b' value='b'>
            {({ pressed }) => <Text>{pressed ? 'B-ON' : 'B-OFF'}</Text>}
          </Toggle>
        </ToggleGroup>,
      );

      const group = screen.getByTestId('group-multi');
      const toggleA = screen.getByTestId('toggle-a');
      const toggleB = screen.getByTestId('toggle-b');

      expect(group.props.role).toBe('group');

      fireEvent.press(toggleA);
      expect(screen.getByText('A-ON')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith(['a']);

      fireEvent.press(toggleB);
      expect(screen.getByText('B-ON')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith(['a', 'b']);

      fireEvent.press(toggleA);
      expect(screen.getByText('A-OFF')).toBeTruthy();
      expect(screen.getByText('B-ON')).toBeTruthy();
      expect(onValueChangeMock).toHaveBeenLastCalledWith(['b']);
    });
  });

  describe('Controlled State', () => {
    it('does not change internal state when controlled but fires onValueChange', () => {
      const onValueChangeMock = jest.fn();
      render(
        <ToggleGroup onValueChange={onValueChangeMock} value={['a']}>
          <Toggle testID='toggle-a' value='a'>
            {({ pressed }) => <Text>{pressed ? 'A-ON' : 'A-OFF'}</Text>}
          </Toggle>
          <Toggle testID='toggle-b' value='b'>
            {({ pressed }) => <Text>{pressed ? 'B-ON' : 'B-OFF'}</Text>}
          </Toggle>
        </ToggleGroup>,
      );

      const toggleB = screen.getByTestId('toggle-b');

      expect(screen.getByText('A-ON')).toBeTruthy();
      expect(screen.getByText('B-OFF')).toBeTruthy();

      fireEvent.press(toggleB);

      expect(onValueChangeMock).toHaveBeenCalledTimes(1);
      expect(onValueChangeMock).toHaveBeenCalledWith(['b']);
      expect(screen.getByText('A-ON')).toBeTruthy();
      expect(screen.getByText('B-OFF')).toBeTruthy();
    });
  });

  describe('Disabled State Propagation', () => {
    it('disables all child toggles when the group is disabled', () => {
      const onValueChangeMock = jest.fn();
      render(
        <ToggleGroup disabled onValueChange={onValueChangeMock}>
          <Toggle testID='toggle-a' value='a'>
            {({ disabled }) => (
              <Text>{disabled ? 'A-LOCKED' : 'A-ACTIVE'}</Text>
            )}
          </Toggle>
          <Toggle disabled={false} testID='toggle-b' value='b'>
            {({ disabled }) => (
              <Text>{disabled ? 'B-LOCKED' : 'B-ACTIVE'}</Text>
            )}
          </Toggle>
        </ToggleGroup>,
      );

      // Tell Testing Library to look inside hidden/disabled accessibility nodes
      expect(
        screen.getByText('A-LOCKED', { includeHiddenElements: true }),
      ).toBeTruthy();
      expect(
        screen.getByText('B-LOCKED', { includeHiddenElements: true }),
      ).toBeTruthy();

      fireEvent.press(
        screen.getByTestId('toggle-a', { includeHiddenElements: true }),
      );
      fireEvent.press(
        screen.getByTestId('toggle-b', { includeHiddenElements: true }),
      );

      expect(onValueChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Navigation', () => {
    it('delegates arrow keys to roving focus management', () => {
      const onFocusChangeMock = jest.fn();
      render(
        <ToggleGroup onFocusChange={onFocusChangeMock}>
          <Toggle testID='toggle-a' value='a' />
          <Toggle testID='toggle-b' value='b' />
          <Toggle testID='toggle-c' value='c' />
        </ToggleGroup>,
      );

      const toggleB = screen.getByTestId('toggle-b');

      fireEvent(toggleB, 'keyDown', { nativeEvent: { key: 'ArrowRight' } });
      expect(onFocusChangeMock).toHaveBeenLastCalledWith('c');

      fireEvent(toggleB, 'keyDown', { nativeEvent: { key: 'ArrowLeft' } });
      expect(onFocusChangeMock).toHaveBeenLastCalledWith('a');
    });
  });

  describe('Ref Forwarding', () => {
    it('successfully forwards a ref to the underlying View', () => {
      const ref = React.createRef<View>();

      render(
        <ToggleGroup ref={ref} testID='ref-group'>
          <Toggle value='a' />
        </ToggleGroup>,
      );

      expect(ref.current).toBeTruthy();
      expect(ref.current).toHaveProperty('measure');
    });
  });

  describe('Development Warnings', () => {
    const originalWarn = console.warn;

    beforeEach(() => {
      console.warn = jest.fn();
    });

    afterEach(() => {
      console.warn = originalWarn;
    });

    // Make this async so we can await the useEffect flush
    it('warns if multiple toggles share the same value', async () => {
      render(
        <ToggleGroup>
          <Toggle value='duplicate' />
          <Toggle value='duplicate' />
        </ToggleGroup>,
      );

      // Wait for React to run the side effects
      await waitFor(() => {
        expect(console.warn).toHaveBeenCalledWith(
          expect.stringContaining('Duplicate value "duplicate" detected'),
        );
      });
    });
  });
});
