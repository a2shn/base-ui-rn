import { renderHook } from '@testing-library/react-native';
import { GestureResponderEvent } from 'react-native';

import { useActivationDedup, UseActivationDedupOptions } from './use-activation-dedup';

describe('useActivationDedup', () => {
  it('handles standard pointer press', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: false, onCommit, pressed: false }),
    );

    const mockEvent = { nativeEvent: {} } as unknown as GestureResponderEvent;
    result.current.handlePress(mockEvent);

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(true);
  });

  it('handles standard keyboard activation', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: false, onCommit, pressed: true }),
    );

    result.current.handleKeyboardActivation();

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(false);
  });

  it('swallows the synthesized ghost press immediately following a keyboard activation', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: false, onCommit, pressed: false }),
    );

    const mockEvent = { nativeEvent: {} } as unknown as GestureResponderEvent;

    result.current.handleKeyboardActivation();
    result.current.handlePress(mockEvent);

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(true);
  });

  it('accepts a subsequent real pointer press after swallowing a ghost press', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: false, onCommit, pressed: false }),
    );

    const ghostEvent = { nativeEvent: { type: 'ghost' } } as unknown as GestureResponderEvent;
    const realEvent = { nativeEvent: { type: 'real' } } as unknown as GestureResponderEvent;

    result.current.handleKeyboardActivation();
    result.current.handlePress(ghostEvent);
    result.current.handlePress(realEvent);

    expect(onCommit).toHaveBeenCalledTimes(2);
    expect(onCommit).toHaveBeenNthCalledWith(1, true);
    expect(onCommit).toHaveBeenNthCalledWith(2, true);
  });

  it('handles standard accessibility activation', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: false, onCommit, pressed: false }),
    );

    result.current.handleAccessibilityActivation();

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onCommit).toHaveBeenCalledWith(true);
  });

  it('blocks all activation paths when disabled', () => {
    const onCommit = jest.fn();
    const { result } = renderHook(() =>
      useActivationDedup({ disabled: true, onCommit, pressed: false }),
    );

    const mockEvent = { nativeEvent: {} } as unknown as GestureResponderEvent;

    result.current.handlePress(mockEvent);
    result.current.handleKeyboardActivation();
    result.current.handleAccessibilityActivation();

    expect(onCommit).not.toHaveBeenCalled();
  });

  it('dynamically adapts to disabled prop changes mid-flight', () => {
    const onCommit = jest.fn();
    const { rerender, result } = renderHook(
      (props: UseActivationDedupOptions<boolean>) => useActivationDedup(props),
      { initialProps: { disabled: false, onCommit, pressed: false } },
    );

    result.current.handleKeyboardActivation();
    expect(onCommit).toHaveBeenCalledTimes(1);

    rerender({ disabled: true, onCommit, pressed: true });

    result.current.handleKeyboardActivation();
    expect(onCommit).toHaveBeenCalledTimes(1);
  });

  it('uses getNextPressed custom resolver if provided', () => {
    const onCommit = jest.fn();
    const getNextPressed = jest.fn((current: string) => `${current}-toggled`);
    const { result } = renderHook(() =>
      useActivationDedup({
        disabled: false,
        getNextPressed,
        onCommit,
        pressed: 'active',
      }),
    );

    result.current.handleAccessibilityActivation();

    expect(getNextPressed).toHaveBeenCalledWith('active');
    expect(onCommit).toHaveBeenCalledWith('active-toggled');
  });

  it('reads the latest pressed value without requiring handler dependencies to update', () => {
    const onCommit = jest.fn();
    const { rerender, result } = renderHook(
      (props: UseActivationDedupOptions<boolean>) => useActivationDedup(props),
      { initialProps: { disabled: false, onCommit, pressed: false } },
    );

    result.current.handleAccessibilityActivation();
    expect(onCommit).toHaveBeenLastCalledWith(true);

    rerender({ disabled: false, onCommit, pressed: true });

    result.current.handleAccessibilityActivation();
    expect(onCommit).toHaveBeenLastCalledWith(false);
  });
});
