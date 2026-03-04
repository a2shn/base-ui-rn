import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
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

  it('supports style as a function of state', () => {
    const { getByTestId } = render(
      <Button
        testID='button'
        focusVisible={true}
        style={({ focusVisible }) => ({
          backgroundColor: focusVisible ? 'blue' : 'red',
        })}
      >
        <Text>Style</Text>
      </Button>,
    );
    const button = getByTestId('button');
    expect(StyleSheet.flatten(button.props.style).backgroundColor).toBe('blue');
  });

  it('provides state to children function', () => {
    const { getByTestId } = render(
      <Button testID='button' focusVisible={true}>
        {({ focusVisible }) => (
          <Text testID='text'>{focusVisible ? 'Focused' : 'Idle'}</Text>
        )}
      </Button>,
    );
    const text = getByTestId('text');
    expect(text.props.children).toBe('Focused');
  });
});
