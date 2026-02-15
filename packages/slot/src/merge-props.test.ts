import { mergeProps } from './merge-props';
import { mergeHandlers } from './merge-handlers';

jest.mock('./merge-handlers', () => ({
  mergeHandlers: jest.fn((injected, child) => {
    if (!injected) return child;
    if (!child) return injected;
    return function merged(...args: unknown[]) {
      injected(...args);
      child(...args);
    };
  }),
}));

describe('mergeProps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Standard Props Resolution', () => {
    it('prioritizes child props over injected props for non-critical keys', () => {
      const injected = { testID: 'injected-id', customProp: 'injected-custom' };
      const child = { testID: 'child-id', customProp: 'child-custom' };

      const result = mergeProps(injected, child);

      expect(result.testID).toBe('child-id');
      expect(result.customProp).toBe('child-custom');
    });

    it('falls back to injected props when child prop is undefined', () => {
      const injected = { testID: 'injected-id' };
      // Cast to allow the intersection to resolve testID as string
      const child = { testID: undefined as string | undefined };

      const result = mergeProps(injected, child);

      expect(result.testID).toBe('injected-id');
    });
  });

  describe('CRITICAL Props Resolution', () => {
    it('prioritizes injected props over child props for CRITICAL keys', () => {
      const injected = {
        accessibilityRole: 'button' as const,
        focusable: true,
      };
      const child = { accessibilityRole: 'link' as const, focusable: false };

      const result = mergeProps(injected, child);

      expect(result.accessibilityRole).toBe('button');
      expect(result.focusable).toBe(true);
    });
  });

  describe('Accessibility Object Merging', () => {
    it('deep merges accessibilityState objects, prioritizing injected values', () => {
      const injected = {
        accessibilityState: { expanded: true, disabled: false },
      };
      const child = { accessibilityState: { disabled: true, busy: true } };

      const result = mergeProps(injected, child);

      expect(result.accessibilityState).toEqual({
        expanded: true,
        disabled: false,
        busy: true,
      });
    });

    it('deep merges accessibilityValue objects, prioritizing injected values', () => {
      const injected = { accessibilityValue: { max: 100, now: 50 } };
      const child = { accessibilityValue: { min: 0, now: 25 } };

      const result = mergeProps(injected, child);

      expect(result.accessibilityValue).toEqual({
        min: 0,
        max: 100,
        now: 50,
      });
    });
  });

  describe('Event Handlers Merging', () => {
    it('merges functions starting with "on"', () => {
      const injectedFn = jest.fn();
      const childFn = jest.fn();

      const injected = { onPress: injectedFn };
      const child = { onPress: childFn };

      const result = mergeProps(injected, child);

      expect(mergeHandlers).toHaveBeenCalledWith(injectedFn, childFn);

      if (typeof result.onPress === 'function') {
        result.onPress({ type: 'press' });
      }

      expect(injectedFn).toHaveBeenCalledTimes(1);
      expect(childFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Style Merging', () => {
    it('merges style objects into an array with injected styles first', () => {
      const injected = { style: { backgroundColor: 'red' } };
      const child = { style: { opacity: 0.5 } };

      const result = mergeProps(injected, child);

      expect(result.style).toEqual([
        { backgroundColor: 'red' },
        { opacity: 0.5 },
      ]);
    });

    it('spreads child style if it is already an array', () => {
      const injected = { style: { backgroundColor: 'red' } };
      const child = { style: [{ opacity: 0.5 }] };

      const result = mergeProps(injected, child);

      expect(result.style).toEqual([
        { backgroundColor: 'red' },
        { opacity: 0.5 },
      ]);
    });

    it('uses injected style directly if child has no style', () => {
      const injected = { style: { backgroundColor: 'red' } };
      const child = { style: undefined as unknown as Record<string, unknown> };

      const result = mergeProps(injected, child);

      expect(result.style).toEqual({ backgroundColor: 'red' });
    });
  });
});
