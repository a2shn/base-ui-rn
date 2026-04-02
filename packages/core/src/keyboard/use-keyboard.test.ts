import { renderHook } from '@testing-library/react-native';
import { NativeSyntheticEvent } from 'react-native';

import { KeyDownEventData } from '../types';
import { useKeyboard } from './use-keyboard';

describe('useKeyboard', () => {
  it('maps correct keys to handlers and prevents default', () => {
    const onArrowDown = jest.fn();
    const onHome = jest.fn();
    const preventDefault = jest.fn();

    const { result } = renderHook(() => useKeyboard({ onArrowDown, onHome }));

    result.current({
      nativeEvent: { key: 'ArrowDown' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onArrowDown).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);

    result.current({
      nativeEvent: { key: 'Home' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onHome).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(2);

    result.current({
      nativeEvent: { key: 'ArrowUp' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  it('does nothing when disabled', () => {
    const onArrowDown = jest.fn();
    const { result } = renderHook(() =>
      useKeyboard({ disabled: true, onArrowDown }),
    );

    result.current({
      nativeEvent: { key: 'ArrowDown' },
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onArrowDown).not.toHaveBeenCalled();
  });

  it('handles event.key fallback', () => {
    const onEnd = jest.fn();
    const { result } = renderHook(() => useKeyboard({ onEnd }));

    result.current({
      key: 'End',
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });
});
