import { render } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Toggle } from '../toggle';

describe('Toggle - Rendering', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
      <Toggle>
        <Text>Toggle Me</Text>
      </Toggle>,
    );
    expect(getByText('Toggle Me')).toBeDefined();
  });

  it('forwards ref to the underlying View', () => {
    const ref = React.createRef<View>();
    render(
      <Toggle ref={ref}>
        <Text>Ref</Text>
      </Toggle>,
    );
    expect(ref.current).toBeDefined();
  });

  it('supports style as a function of pressed state', () => {
    const { getByTestId } = render(
      <Toggle
        pressed={true}
        style={({ pressed }) => ({
          backgroundColor: pressed ? 'red' : 'blue',
        })}
        testID='toggle'
        value='debug-toggle'
      >
        <Text>Style</Text>
      </Toggle>,
    );
    const toggle = getByTestId('toggle');
    // Note: In some test environments, the style might be an array or flattened.
    // We check for red which corresponds to pressed=true.
    expect(StyleSheet.flatten(toggle.props.style)).toMatchObject({
      backgroundColor: 'red',
    });
  });

  it('provides pressed state to children function', () => {
    const { getByText } = render(
      <Toggle pressed={true}>
        {({ pressed }) => <Text>{pressed ? 'Active' : 'Inactive'}</Text>}
      </Toggle>,
    );
    expect(getByText('Active')).toBeDefined();
  });
});
