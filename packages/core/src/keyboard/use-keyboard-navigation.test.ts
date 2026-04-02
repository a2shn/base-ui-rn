import { act, renderHook } from '@testing-library/react-native';
import * as React from 'react';
import { NativeSyntheticEvent, Platform } from 'react-native';

import { KeyDownEventData } from '../types';
import { useKeyboardNavigation } from './use-keyboard-navigation';

describe('useKeyboardNavigation', () => {
  const setupItems = (
    registerItem: ReturnType<typeof useKeyboardNavigation>['registerItem'],
    count: number,
  ) => {
    const refs: React.RefObject<{ focus: jest.Mock }>[] = [];
    const unregisters = [];
    for (let i = 0; i < count; i++) {
      const ref = { current: { focus: jest.fn() } };
      refs.push(ref);
      unregisters.push(
        registerItem(`item-${i}`, ref as unknown as React.RefObject<unknown>),
      );
    }
    return { refs, unregisters };
  };

  it('registers and unregisters items', () => {
    const { result } = renderHook(() => useKeyboardNavigation());

    act(() => {
      const unregister = result.current.registerItem(
        'test-1',
        React.createRef(),
      );
      expect(result.current.navigate('test-1', 'next')).toBe('test-1');
      unregister();
    });
  });

  it('navigates next and prev with looping enabled by default', () => {
    const { result } = renderHook(() => useKeyboardNavigation());

    act(() => {
      setupItems(result.current.registerItem, 3);
    });

    expect(result.current.navigate('item-0', 'next')).toBe('item-1');
    expect(result.current.navigate('item-1', 'next')).toBe('item-2');
    expect(result.current.navigate('item-2', 'next')).toBe('item-0');

    expect(result.current.navigate('item-0', 'prev')).toBe('item-2');
    expect(result.current.navigate('item-2', 'prev')).toBe('item-1');
  });

  it('navigates next and prev with looping disabled', () => {
    const { result } = renderHook(() => useKeyboardNavigation({ loop: false }));

    act(() => {
      setupItems(result.current.registerItem, 3);
    });

    expect(result.current.navigate('item-2', 'next')).toBe('item-2');
    expect(result.current.navigate('item-0', 'prev')).toBe('item-0');
  });

  it('navigates to first and last', () => {
    const { result } = renderHook(() => useKeyboardNavigation());

    act(() => {
      setupItems(result.current.registerItem, 5);
    });

    expect(result.current.navigate('item-2', 'first')).toBe('item-0');
    expect(result.current.navigate('item-2', 'last')).toBe('item-4');
  });

  it('handles keydown events and triggers focus synchronously on web', () => {
    const originalOS = Platform.OS;
    Platform.OS = 'web';

    const { result } = renderHook(() =>
      useKeyboardNavigation({ orientation: 'horizontal' }),
    );

    let refs: React.RefObject<{ focus: jest.Mock }>[] = [];
    act(() => {
      refs = setupItems(result.current.registerItem, 3).refs;
    });

    const preventDefault = jest.fn();

    act(() => {
      const nextId = result.current.handleKeyDown('item-0', {
        nativeEvent: { key: 'ArrowRight' },
        preventDefault,
      } as unknown as NativeSyntheticEvent<KeyDownEventData>);
      expect(nextId).toBe('item-1');
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(refs[1].current!.focus).toHaveBeenCalledTimes(1);

    Platform.OS = originalOS;
  });

  it('handles keydown events and triggers focus asynchronously on native', () => {
    jest.useFakeTimers();
    const originalOS = Platform.OS;
    Platform.OS = 'ios';

    const { result } = renderHook(() =>
      useKeyboardNavigation({ orientation: 'vertical' }),
    );

    let refs: React.RefObject<{ focus: jest.Mock }>[] = [];
    act(() => {
      refs = setupItems(result.current.registerItem, 3).refs;
    });

    act(() => {
      result.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowDown' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    });

    expect(refs[2].current!.focus).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(refs[2].current!.focus).toHaveBeenCalledTimes(1);

    Platform.OS = originalOS;
    jest.useRealTimers();
  });

  it('respects orientation mappings', () => {
    const { result: horizontalResult } = renderHook(() =>
      useKeyboardNavigation({ orientation: 'horizontal' }),
    );
    act(() => {
      setupItems(horizontalResult.current.registerItem, 3);
    });

    expect(
      horizontalResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowRight' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-2');
    expect(
      horizontalResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowDown' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBeNull();

    const { result: verticalResult } = renderHook(() =>
      useKeyboardNavigation({ orientation: 'vertical' }),
    );
    act(() => {
      setupItems(verticalResult.current.registerItem, 3);
    });

    expect(
      verticalResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowDown' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-2');
    expect(
      verticalResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowRight' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBeNull();

    const { result: bothResult } = renderHook(() =>
      useKeyboardNavigation({ orientation: 'both' }),
    );
    act(() => {
      setupItems(bothResult.current.registerItem, 3);
    });

    expect(
      bothResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowDown' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-2');
    expect(
      bothResult.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'ArrowRight' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-2');
  });

  it('merges custom key maps', () => {
    const { result } = renderHook(() =>
      useKeyboardNavigation({
        keyMap: { next: ['w'], prev: ['q'] },
      }),
    );

    act(() => {
      setupItems(result.current.registerItem, 3);
    });

    expect(
      result.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'w' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-2');
    expect(
      result.current.handleKeyDown('item-1', {
        nativeEvent: { key: 'q' },
      } as unknown as NativeSyntheticEvent<KeyDownEventData>),
    ).toBe('item-0');
  });
});
