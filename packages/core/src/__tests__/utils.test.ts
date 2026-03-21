import { StyleProp, ViewStyle } from 'react-native';

import { DEFAULT_FOCUS_RING_STYLE } from '../constants';
import {
  clamp,
  evaluateStyles,
  mergeRefs,
  resolveFocusRingStyle,
} from '../utils';

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

describe('resolveFocusRingStyle', () => {
  it('should return null when focusVisible is false', () => {
    expect(resolveFocusRingStyle(false)).toBeNull();
  });

  it('should return customStyle when provided', () => {
    const custom = { backgroundColor: 'red' };
    expect(resolveFocusRingStyle(true, false, custom)).toBe(custom);
  });

  it('should return null when disableDefault is true', () => {
    expect(resolveFocusRingStyle(true, true)).toBeNull();
  });

  it('should return defaultStyle when focusVisible is true and no custom/disable', () => {
    expect(resolveFocusRingStyle(true)).toBe(DEFAULT_FOCUS_RING_STYLE);
  });

  it('should use provided defaultStyle', () => {
    const customDefault = { borderWidth: 5 };
    expect(resolveFocusRingStyle(true, false, undefined, customDefault)).toBe(
      customDefault,
    );
  });
});

describe('evaluateStyles', () => {
  it('should evaluate static style and resolve focus ring', () => {
    const style = { color: 'blue' } as StyleProp<ViewStyle>;
    const state = { focusVisible: true };
    const result = evaluateStyles(style, state);
    expect(result).toEqual([style, DEFAULT_FOCUS_RING_STYLE]);
  });

  it('should evaluate function style and resolve focus ring', () => {
    const styleFn = (state: { focusVisible: boolean }) =>
      state.focusVisible ? { borderWidth: 1 } : { borderWidth: 0 };
    const state = { focusVisible: true };
    const result = evaluateStyles(styleFn, state);
    expect(result).toEqual([{ borderWidth: 1 }, DEFAULT_FOCUS_RING_STYLE]);
  });

  it('should disable default focus ring', () => {
    const style = { color: 'blue' } as StyleProp<ViewStyle>;
    const state = { focusVisible: true };
    const result = evaluateStyles(style, state, {
      disableDefaultFocusRing: true,
    });
    expect(result).toEqual(style);
  });

  it('should use custom focus ring style', () => {
    const style = { color: 'blue' } as StyleProp<ViewStyle>;
    const customFocusRing = { outlineColor: 'green' } as StyleProp<ViewStyle>;
    const state = { focusVisible: true };
    const result = evaluateStyles(style, state, {
      focusRingStyle: customFocusRing,
    });
    expect(result).toEqual([style, customFocusRing]);
  });

  it('should return style without focus ring if not focusVisible', () => {
    const style = { color: 'blue' } as StyleProp<ViewStyle>;
    const state = { focusVisible: false };
    const result = evaluateStyles(style, state);
    expect(result).toEqual(style);
  });

  it('should return non-style values as-is', () => {
    const children = 'hello';
    const state = { focusVisible: true };
    const result = evaluateStyles(children, state);
    expect(result).toBe('hello');
  });
});
