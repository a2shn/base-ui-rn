import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Toggle } from '../toggle';
import { DEFAULT_HINT } from '@base-ui-rn/test-utils';

describe('Toggle - Ref Forwarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards ref to the internal Pressable component', () => {
    const ref = React.createRef<View>();
    render(
      <Toggle ref={ref} accessibilityHint={DEFAULT_HINT}>
        <Text>Ref Target</Text>
      </Toggle>,
    );

    expect(ref.current).toBeDefined();
  });

  it('allows accessing native properties through forwarded ref', () => {
    const ref = React.createRef<View>();
    render(
      <Toggle ref={ref} accessibilityHint={DEFAULT_HINT}>
        <Text>Ref Access</Text>
      </Toggle>,
    );

    expect(ref.current).toBeDefined();
    expect(ref.current?.props).toBeDefined();
  });
});
