import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: Ref Forwarding', () => {
  it('should forward ref to the underlying View component', () => {
    const ref = React.createRef<View>();
    render(
      <PressableWithKeyPress ref={ref}>
        <Text>Test</Text>
      </PressableWithKeyPress>,
    );
    expect(ref.current).not.toBeNull();
    expect(ref.current).toBeInstanceOf(View);
  });

  it('should work with a callback ref', () => {
    const refCallback = jest.fn();
    render(
      <PressableWithKeyPress ref={refCallback}>
        <Text>Test</Text>
      </PressableWithKeyPress>,
    );
    expect(refCallback).toHaveBeenCalledTimes(1);
    expect(refCallback.mock.calls[0][0]).toBeInstanceOf(View);
  });
});
