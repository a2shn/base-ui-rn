import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Separator } from '../index';

describe('Separator - Ref Forwarding', () => {
  it('forwards ref to the internal View component', () => {
    const ref = React.createRef<View>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeDefined();
  });

  it('works with callback refs', () => {
    let internalRef: View | null = null;
    const callbackRef = (el: View | null) => {
      internalRef = el;
    };

    render(<Separator ref={callbackRef} />);
    expect(internalRef).toBeDefined();
  });

  it('ref persists across re-renders', () => {
    const ref = React.createRef<View>();
    const { rerender } = render(<Separator ref={ref} />);
    const initialRef = ref.current;

    rerender(<Separator decorative ref={ref} />);
    expect(ref.current).toBe(initialRef);
  });
});
