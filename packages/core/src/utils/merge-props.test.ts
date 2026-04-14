// FILE: ./packages/core/src/utils/merge-props.test.ts
import * as React from 'react';

import { mergeProps } from './merge-props';

describe('mergeProps', () => {
  describe('Standard Props (First-in-Wins)', () => {
    it('prioritizes the first defined value for standard props', () => {
      const result = mergeProps(
        { id: 'internal-id', role: 'button' },
        { id: 'user-id', tabIndex: 0 },
        { accessible: true, role: 'default-role' },
      );

      expect(result).toEqual({
        accessible: true, // Third arg provides this
        id: 'internal-id', // First arg wins
        role: 'button', // First arg wins over default
        tabIndex: 0, // Second arg provides this
      });
    });

    it('ignores undefined values in subsequent arguments', () => {
      const result = mergeProps(
        { accessible: true },
        { accessible: undefined },
      );
      expect(result.accessible).toBe(true);
    });
  });

  describe('Event Handlers', () => {
    it('composes multiple event handlers into a single function', () => {
      const onPress1 = jest.fn();
      const onPress2 = jest.fn();

      const result = mergeProps({ onPress: onPress1 }, { onPress: onPress2 });

      // Trigger the composed function
      result.onPress({ type: 'press' });

      expect(onPress1).toHaveBeenCalledTimes(1);
      expect(onPress2).toHaveBeenCalledTimes(1);
    });

    it('preserves a single event handler if the other is undefined', () => {
      const onPressMock = jest.fn();

      // Left side exists, right side undefined
      const result1 = mergeProps(
        { onPress: onPressMock },
        { onPress: undefined },
      );
      expect(result1.onPress).toBe(onPressMock);

      // Left side undefined, right side exists
      const result2 = mergeProps(
        { onPress: undefined },
        { onPress: onPressMock },
      );
      expect(result2.onPress).toBe(onPressMock);
    });

    it('does not attempt to compose non-function props that start with "on"', () => {
      const result = mergeProps(
        { onlyHasBoolean: true },
        { onlyHasBoolean: false },
      );

      // Falls back to First-in-Wins
      expect(result.onlyHasBoolean).toBe(true);
    });
  });

  describe('Special Merges (ref, style, a11y)', () => {
    it('merges styles into an array if multiple exist', () => {
      const style1 = { color: 'red' };
      const style2 = { backgroundColor: 'blue' };

      const result = mergeProps({ style: style1 }, { style: style2 });
      expect(result.style).toEqual([style1, style2]);
    });

    it('preserves a single style object without wrapping it in an array', () => {
      const style1 = { color: 'red' };

      expect(mergeProps({ style: style1 }, { style: undefined }).style).toBe(
        style1,
      );
      expect(mergeProps({ style: null }, { style: style1 }).style).toBe(style1);
    });

    it('merges refs into a composed callback ref', () => {
      const ref1 = React.createRef<unknown>();
      const ref2 = jest.fn();

      const result = mergeProps({ ref: ref1 }, { ref: ref2 });

      // Simulate React attaching the node
      result.ref('node-instance');

      expect(ref1.current).toBe('node-instance');
      expect(ref2).toHaveBeenCalledWith('node-instance');
    });

    it('preserves a single ref if the other is undefined or null', () => {
      const refMock = jest.fn();

      expect(mergeProps({ ref: refMock }, { ref: undefined }).ref).toBe(
        refMock,
      );
      expect(mergeProps({ ref: null }, { ref: refMock }).ref).toBe(refMock);
    });

    it('deep merges accessibilityState', () => {
      const state1 = { checked: true, disabled: true };
      const state2 = { checked: false, expanded: true };

      const result = mergeProps(
        { accessibilityState: state1 },
        { accessibilityState: state2 },
      );

      // Assuming mergeAccessibilityState handles standard object spreading {...a, ...b}
      expect(result.accessibilityState).toEqual({
        checked: false, // In a11y state merges, the later arg usually overrides the earlier one
        disabled: true,
        expanded: true,
      });
    });

    it('combines accessibilityActions', () => {
      const actions1 = [{ name: 'activate' }];
      const actions2 = [{ name: 'magicTap' }];

      const result = mergeProps(
        { accessibilityActions: actions1 },
        { accessibilityActions: actions2 },
      );

      expect(result.accessibilityActions).toEqual([
        { name: 'activate' },
        { name: 'magicTap' },
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('handles null, undefined, and empty objects gracefully', () => {
      const result = mergeProps(
        { id: 'test' },
        null,
        undefined,
        {},
        { name: 'button' },
      );

      expect(result).toEqual({
        id: 'test',
        name: 'button',
      });
    });
  });
});
