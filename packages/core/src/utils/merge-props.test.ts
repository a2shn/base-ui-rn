import * as React from 'react';

import { mergeProps } from './merge-props';

describe('mergeProps', () => {
  it('merges standard props with last-in priority', () => {
    const result = mergeProps({ id: '1', name: 'A' }, { id: '2', value: 'B' });
    expect(result).toEqual({ id: '2', name: 'A', value: 'B' });
  });

  it('composes event handlers starting with "on[CapitalLetter]"', () => {
    const onPress1 = jest.fn();
    const onPress2 = jest.fn();

    const result = mergeProps({ onPress: onPress1 }, { onPress: onPress2 });

    result.onPress({ type: 'press' });

    expect(onPress1).toHaveBeenCalledTimes(1);
    expect(onPress2).toHaveBeenCalledTimes(1);
  });

  it('does not compose non-event functions', () => {
    const renderFoo1 = jest.fn();
    const renderFoo2 = jest.fn();

    const result = mergeProps(
      { renderFoo: renderFoo1 },
      { renderFoo: renderFoo2 },
    );

    expect(result.renderFoo).toBe(renderFoo2);
  });

  it('merges refs into a functional callback ref', () => {
    const ref1 = React.createRef<unknown>();
    const ref2 = jest.fn();

    const result = mergeProps({ ref: ref1 }, { ref: ref2 });
    result.ref('node-instance');

    expect(ref1.current).toBe('node-instance');
    expect(ref2).toHaveBeenCalledWith('node-instance');
  });

  it('merges styles into an array', () => {
    const style1 = { color: 'red' };
    const style2 = { backgroundColor: 'blue' };

    const result = mergeProps({ style: style1 }, { style: style2 });

    expect(result.style).toEqual([style1, style2]);
  });

  it('deep merges accessibilityState', () => {
    const state1 = { disabled: true, checked: true };
    const state2 = { checked: false, expanded: true };

    const result = mergeProps(
      { accessibilityState: state1 },
      { accessibilityState: state2 },
    );

    expect(result.accessibilityState).toEqual({
      disabled: true,
      checked: false,
      expanded: true,
    });
  });

  it('combines accessibilityActions', () => {
    const actions1 = [{ name: 'activate' }];
    const actions2 = [{ name: 'magicTap' }];

    const result = mergeProps(
      { accessibilityActions: actions1 as any },
      { accessibilityActions: actions2 as any },
    );

    expect(result.accessibilityActions).toEqual([
      { name: 'activate' },
      { name: 'magicTap' },
    ]);
  });

  it('handles null and undefined arguments gracefully', () => {
    const result = mergeProps({ a: 1 }, null, undefined, { b: 2 });
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('preserves the initial prop if the subsequent prop is explicitly undefined', () => {
    const result = mergeProps({ a: 1, b: 2 }, { a: undefined, b: 3 });
    expect(result).toEqual({ a: 1, b: 3 });
  });
});
