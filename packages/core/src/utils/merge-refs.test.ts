import { renderHook } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { mergeRefs } from './merge-refs';

describe('mergeRefs', () => {
  it('updates function refs and object refs', () => {
    const objectRef = React.createRef<View>();
    const functionRef = jest.fn();
    const node = {} as View;

    const { result } = renderHook(() => mergeRefs(objectRef, functionRef));

    result.current(node);

    expect(objectRef.current).toBe(node);
    expect(functionRef).toHaveBeenCalledWith(node);
  });

  it('ignores null or undefined refs', () => {
    const objectRef = React.createRef<View>();
    const node = {} as View;

    const { result } = renderHook(() =>
      mergeRefs(objectRef, null, undefined),
    );

    result.current(node);

    expect(objectRef.current).toBe(node);
  });

  it('cleans up refs when called with null', () => {
    const objectRef = React.createRef<View>();
    const functionRef = jest.fn();
    const node = {} as View;

    const { result } = renderHook(() => mergeRefs(objectRef, functionRef));

    result.current(node);
    result.current(null);

    expect(objectRef.current).toBeNull();
    expect(functionRef).toHaveBeenCalledWith(null);
    expect(functionRef).toHaveBeenCalledTimes(2);
  });
});
