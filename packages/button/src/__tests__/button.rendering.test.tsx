import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
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

  it('supports style as a function of pressed state', () => {
    const { getByTestId } = render(
      <Button
        testID='button'
        style={({ pressed }) => ({
          backgroundColor: pressed ? 'red' : 'blue',
        })}
      >
        <Text>Style</Text>
      </Button>,
    );
    const button = getByTestId('button');
    expect(button.props.style.backgroundColor).toBe('blue');
  });

  it('provides pressed state to children function', () => {
    const { getByText } = render(
      <Button>
        {({ pressed }) => <Text>{pressed ? 'Pressed' : 'Idle'}</Text>}
      </Button>,
    );
    expect(getByText('Idle')).toBeDefined();
  });
});
