import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Button } from '../button';
import { DEFAULT_HINT } from '@base-ui-rn/test-utils';

describe('Button - Ref Forwarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards ref to the native Pressable wrapper', () => {
    const ref = React.createRef<View>();

    render(
      <Button ref={ref} accessibilityHint={DEFAULT_HINT}>
        <Text>Ref Test</Text>
      </Button>,
    );

    expect(ref.current).toBeDefined();
  });

  it('allows accessing native properties through forwarded ref', () => {
    const ref = React.createRef<View>();

    render(
      <Button ref={ref} accessibilityHint={DEFAULT_HINT}>
        <Text>Ref Access</Text>
      </Button>,
    );

    expect(ref.current).toBeDefined();
    expect(ref.current?.props).toBeDefined();
  });
});
