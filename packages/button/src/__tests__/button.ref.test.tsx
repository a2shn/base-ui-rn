import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Button } from '../button';

describe('Button - Ref Forwarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards ref to the internal View component', () => {
    const ref = React.createRef<View>();
    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Ref Target</Text>
      </Button>,
    );
    expect(ref.current).toBeDefined();
  });

  it('allows accessing native properties through forwarded ref', () => {
    const ref = React.createRef<View>();
    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Ref Access</Text>
      </Button>,
    );

    expect(ref.current).toBeDefined();
    expect(ref.current?.props).toBeDefined();
  });

  it('ref provides access to props', () => {
    const ref = React.createRef<View>();
    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref} testID='ref-test'>
        <Text>Props</Text>
      </Button>,
    );

    expect(ref.current?.props.testID).toBe('ref-test');
  });

  it('ref persists across re-renders', () => {
    const ref = React.createRef<View>();
    const { rerender } = render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Initial</Text>
      </Button>,
    );

    const initialRef = ref.current;

    rerender(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Updated</Text>
      </Button>,
    );

    expect(ref.current).toBe(initialRef);
  });

  it('works with callback refs', () => {
    let buttonRef: View | null = null;
    const callbackRef = (ref: View | null) => {
      buttonRef = ref;
    };

    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={callbackRef}>
        <Text>Callback Ref</Text>
      </Button>,
    );

    expect(buttonRef).toBeDefined();
  });

  it('works with React.useRef', () => {
    const ref = React.createRef<View>();
    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Use Ref</Text>
      </Button>,
    );
    expect(ref.current).toBeDefined();
  });

  it('ref points to the correct View element with testID', () => {
    const ref = React.createRef<View>();
    render(
      <Button
        accessibilityHint={DEFAULT_HINT}
        ref={ref}
        testID='button-element'
      >
        <Text>Element</Text>
      </Button>,
    );

    expect(ref.current).toBeDefined();
    expect(ref.current?.props.testID).toBe('button-element');
  });

  it('works with multiple buttons', () => {
    const ref1 = React.createRef<View>();
    const ref2 = React.createRef<View>();

    const { rerender } = render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref1} testID='first-button'>
        <Text>First</Text>
      </Button>,
    );

    expect(ref1.current?.props.testID).toBe('first-button');

    rerender(
      <Button
        accessibilityHint={DEFAULT_HINT}
        ref={ref2}
        testID='second-button'
      >
        <Text>Second</Text>
      </Button>,
    );

    expect(ref2.current?.props.testID).toBe('second-button');
  });
});
