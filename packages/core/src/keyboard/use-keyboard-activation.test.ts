import { renderHook } from '@testing-library/react-native';
import { NativeSyntheticEvent } from 'react-native';

import { KeyDownEventData } from '../types';
import { useKeyboardActivation } from './use-keyboard-activation';

describe('useKeyboardActivation', () => {
  it('calls onActivate for activation keys', () => {
    const onActivate = jest.fn();
    const { result } = renderHook(() => useKeyboardActivation(onActivate));

    const preventDefault = jest.fn();

    result.current({
      nativeEvent: { key: 'Enter' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onActivate).toHaveBeenCalledTimes(1);
    expect(preventDefault).toHaveBeenCalledTimes(1);

    result.current({
      nativeEvent: { key: ' ' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onActivate).toHaveBeenCalledTimes(2);

    result.current({
      nativeEvent: { key: 'GamepadA' },
      preventDefault,
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    expect(onActivate).toHaveBeenCalledTimes(3);
  });

  it('does not call onActivate for non-activation keys', () => {
    const onActivate = jest.fn();
    const { result } = renderHook(() => useKeyboardActivation(onActivate));

    result.current({
      nativeEvent: { key: 'A' },
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);
    result.current({
      nativeEvent: { key: 'ArrowDown' },
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('does not call onActivate when disabled', () => {
    const onActivate = jest.fn();
    const { result } = renderHook(() =>
      useKeyboardActivation(onActivate, true),
    );

    result.current({
      nativeEvent: { key: 'Enter' },
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);

    expect(onActivate).not.toHaveBeenCalled();
  });

  it('falls back to event.key if nativeEvent is missing', () => {
    const onActivate = jest.fn();
    const { result } = renderHook(() => useKeyboardActivation(onActivate));

    result.current({
      key: 'Enter',
    } as unknown as NativeSyntheticEvent<KeyDownEventData>);

    expect(onActivate).toHaveBeenCalledTimes(1);
  });
});
