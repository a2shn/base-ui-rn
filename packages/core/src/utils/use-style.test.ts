import { renderHook } from '@testing-library/react-native';

import { evaluateStyles, useStyle } from './use-style';

describe('evaluateStyles', () => {
  it('returns static value directly', () => {
    expect(evaluateStyles({ color: 'red' }, { disabled: false })).toEqual({
      color: 'red',
    });
  });

  it('evaluates function with state', () => {
    const styleFn = (state: { disabled: boolean }) => ({
      opacity: state.disabled ? 0.5 : 1,
    });
    expect(evaluateStyles(styleFn, { disabled: true })).toEqual({
      opacity: 0.5,
    });
    expect(evaluateStyles(styleFn, { disabled: false })).toEqual({
      opacity: 1,
    });
  });
});

describe('useStyle', () => {
  type TestState1 = { active: boolean };
  type TestStyle1 = { backgroundColor: string };

  it('returns memoized base style without additional styles', () => {
    const state: TestState1 = { active: true };
    const style: TestStyle1 = { backgroundColor: 'blue' };

    const { rerender, result } = renderHook(
      ({ state, style }: { state: TestState1; style: TestStyle1 }) =>
        useStyle<TestState1, TestStyle1>({ state, style }),
      { initialProps: { state, style } },
    );

    expect(result.current).toEqual({ backgroundColor: 'blue' });

    const initialResult = result.current;
    rerender({ state, style });
    expect(result.current).toBe(initialResult);
  });

  type TestState2 = { size: number };
  type TestStyle2 = { width?: number; height?: number };

  it('merges single additional style', () => {
    const { result } = renderHook(() =>
      useStyle<TestState2, TestStyle2>({
        additionalStyles: { height: 100 },
        state: { size: 100 },
        style: (s) => ({ width: s.size }),
      }),
    );

    expect(result.current).toEqual([{ width: 100 }, { height: 100 }]);
  });

  type TestState3 = { test: boolean };
  type TestStyle3 = { color?: string; padding?: number; margin?: number };

  it('merges array of additional styles', () => {
    const { result } = renderHook(() =>
      useStyle<TestState3, TestStyle3>({
        additionalStyles: [{ padding: 10 }, { margin: 5 }],
        state: { test: true },
        style: { color: 'black' },
      }),
    );

    expect(result.current).toEqual([
      { color: 'black' },
      { padding: 10 },
      { margin: 5 },
    ]);
  });
});
