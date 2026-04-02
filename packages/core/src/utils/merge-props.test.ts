import { renderHook } from '@testing-library/react-native';
import * as React from 'react';
import { mergeProps } from './merge-props';

describe('mergeProps', () => {
  it('overrides protected keys with internal config', () => {
    const userRef = React.createRef();
    const internalRef = React.createRef();

    const { result } = renderHook(() =>
      mergeProps(
        {
          disabled: false,
          focusable: true,
          ref: userRef,
          style: { color: 'red' },
          testID: 'my-component',
        },
        {
          disabled: true,
          focusable: false,
          ref: internalRef,
          style: { backgroundColor: 'blue' },
          handlers: {},
        }
      )
    );

    expect(result.current.disabled).toBe(true);
    expect(result.current.focusable).toBe(false);
    expect(result.current.ref).toBe(internalRef);
    expect(result.current.style).toEqual({ backgroundColor: 'blue' });
    expect(result.current.testID).toBe('my-component');
  });

  it('passes through arbitrary user props', () => {
    const { result } = renderHook(() =>
      mergeProps(
        { customProp: 'value', numberOfLines: 2 },
        {
          disabled: false,
          focusable: true,
          ref: null,
          style: undefined,
          handlers: {},
        }
      )
    );

    expect(result.current.customProp).toBe('value');
    expect(result.current.numberOfLines).toBe(2);
  });

  it('composes event handlers', () => {
    const userOnPress = jest.fn();
    const internalOnPress = jest.fn();

    const { result } = renderHook(() =>
      mergeProps(
        { onPress: userOnPress },
        {
          disabled: false,
          focusable: true,
          ref: null,
          style: undefined,
          handlers: { onPress: internalOnPress },
        }
      )
    );

    expect(typeof result.current.onPress).toBe('function');

    result.current.onPress({ type: 'press' });

    expect(userOnPress).toHaveBeenCalledWith({ type: 'press' });
    expect(internalOnPress).toHaveBeenCalledWith({ type: 'press' });
  });

  it('deep merges accessibilityState', () => {
    const { result } = renderHook(() =>
      mergeProps(
        { accessibilityState: { checked: true, expanded: false } },
        {
          disabled: false,
          focusable: true,
          ref: null,
          style: undefined,
          handlers: {},
          accessibilityState: { disabled: true, expanded: true },
        }
      )
    );

    expect(result.current.accessibilityState).toEqual({
      checked: true,
      expanded: false,
      disabled: true,
    });
  });

  it('deep merges accessibilityActions', () => {
    const { result } = renderHook(() =>
      mergeProps(
        { accessibilityActions: [{ name: 'magicTap' }] },
        {
          disabled: false,
          focusable: true,
          ref: null,
          style: undefined,
          handlers: {},
          accessibilityActions: [{ name: 'activate' }],
        }
      )
    );

    expect(result.current.accessibilityActions).toEqual([
      { name: 'activate' },
      { name: 'magicTap' },
    ]);
  });

  it('does not append undefined accessibility properties', () => {
    const { result } = renderHook(() =>
      mergeProps(
        { testID: 'no-a11y' },
        {
          disabled: false,
          focusable: true,
          ref: null,
          style: undefined,
          handlers: {},
        }
      )
    );

    expect(result.current).not.toHaveProperty('accessibilityState');
    expect(result.current).not.toHaveProperty('accessibilityActions');
  });
});
