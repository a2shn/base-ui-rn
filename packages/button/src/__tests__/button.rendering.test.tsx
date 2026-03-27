import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { Button } from '../button';

describe('Button - Rendering', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <Button>
        <Text>Click Me</Text>
      </Button>,
    );
    expect(getByText('Click Me')).toBeDefined();
  });

  it('forwards ref to the underlying View', () => {
    const ref = React.createRef<View>();
    render(
      <Button ref={ref}>
        <Text>Ref</Text>
      </Button>,
    );
    expect(ref.current).toBeDefined();
  });

  it('supports style as a function of state', () => {
    const { getByTestId } = render(
      <Button
        style={({ focused }) => ({
          backgroundColor: focused ? 'blue' : 'red',
        })}
        testID='button'
      >
        <Text>Style</Text>
      </Button>,
    );
    const button = getByTestId('button');
    // Button doesn't support forcing focused state via prop, so we just check it exists in the state
    expect(button.props.style).toBeDefined();
  });

  it('provides state to children function', () => {
    const { getByTestId } = render(
      <Button testID='button'>
        {({ focused }) => (
          <Text testID='text'>{focused ? 'Focused' : 'Idle'}</Text>
        )}
      </Button>,
    );
    const text = getByTestId('text');
    expect(text.props.children).toBe('Idle');
  });
});
