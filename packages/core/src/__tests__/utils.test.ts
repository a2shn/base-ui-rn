import { StyleProp, ViewStyle } from 'react-native';

import { clamp, evaluateStyles, mergeRefs } from '../utils';

describe('clamp', () => {
  it('should clamp value within bounds', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should clamp value below min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should clamp value above max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('should handle negative bounds', () => {
    expect(clamp(-5, -10, -1)).toBe(-5);
    expect(clamp(0, -10, -1)).toBe(-1);
    expect(clamp(-15, -10, -1)).toBe(-10);
  });
});

describe('mergeRefs', () => {
  it('should merge function refs', () => {
    const ref1 = jest.fn();
    const ref2 = jest.fn();
    const merged = mergeRefs(ref1, ref2);
    const node = {}; // Use a plain object
    merged(node);
    expect(ref1).toHaveBeenCalledWith(node);
    expect(ref2).toHaveBeenCalledWith(node);
  });

  it('should merge object refs', () => {
    const ref1 = { current: null as unknown as HTMLElement };
    const ref2 = { current: null as unknown as HTMLElement };
    const merged = mergeRefs(ref1, ref2);
    const node = {} as unknown as HTMLElement;
    merged(node);
    expect(ref1.current).toBe(node);
    expect(ref2.current).toBe(node);
  });

  it('should merge mixed refs', () => {
    const ref1 = jest.fn();
    const ref2 = { current: null as unknown as HTMLElement };
    const merged = mergeRefs(ref1, ref2);
    const node = {} as unknown as HTMLElement;
    merged(node);
    expect(ref1).toHaveBeenCalledWith(node);
    expect(ref2.current).toBe(node);
  });

  it('should handle null/undefined refs', () => {
    const ref1 = jest.fn();
    const merged = mergeRefs(ref1, null, undefined);
    const node = {}; // Use a plain object
    merged(node);
    expect(ref1).toHaveBeenCalledWith(node);
  });

  it('should handle no refs', () => {
    const merged = mergeRefs();
    const node = {}; // Use a plain object
    expect(() => merged(node)).not.toThrow();
  });
});

describe('evaluateStyles', () => {
  it('should evaluate static style', () => {
    const style = { color: 'blue' } as StyleProp<ViewStyle>;
    const state = { focused: true };
    const result = evaluateStyles(style, state);
    expect(result).toEqual(style);
  });

  it('should evaluate function style', () => {
    const styleFn = (state: { focused: boolean }) =>
      state.focused ? { borderWidth: 1 } : { borderWidth: 0 };
    const state = { focused: true };
    const result = evaluateStyles(styleFn, state);
    expect(result).toEqual({ borderWidth: 1 });
  });

  it('should return non-style values as-is', () => {
    const children = 'hello';
    const state = { focused: true };
    const result = evaluateStyles(children, state);
    expect(result).toBe('hello');
  });
});
