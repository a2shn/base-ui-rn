import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Button } from '../button';

describe('Button - Ref Forwarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards ref to the native Pressable wrapper', () => {
    const ref = React.createRef<View>();

    render(
      <Button accessibilityHint={DEFAULT_HINT} ref={ref}>
        <Text>Ref Test</Text>
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
});
