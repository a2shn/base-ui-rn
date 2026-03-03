import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import { ToggleGroup } from '../toggle-group';
import { Toggle } from '@base-ui-rn/toggle';

describe('ToggleGroup - Rendering & Props', () => {
  it('renders a View as the container', () => {
    const { getByTestId } = render(
      <ToggleGroup testID='group'>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group).toBeDefined();
    // In RNTL, we check the type or just existence
  });

  it('forwards ref to the native View', () => {
    const ref = React.createRef<View>();

    render(
      <ToggleGroup ref={ref}>
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    expect(ref.current).toBeDefined();
  });

  it('supports style as a function of state', () => {
    const { getByTestId } = render(
      <ToggleGroup
        testID='group'
        value={['a']}
        style={({ value }) => ({
          backgroundColor: value.includes('a') ? 'red' : 'blue',
        })}
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group.props.style.backgroundColor).toBe('red');
  });

  it('supports children as a function of state', () => {
    const { getByText } = render(
      <ToggleGroup value={['a']}>
        {({ value }) => (
          <Text>{value.includes('a') ? 'A selected' : 'none'}</Text>
        )}
      </ToggleGroup>,
    );

    expect(getByText('A selected')).toBeDefined();
  });

  it('forwards other ViewProps to the container', () => {
    const { getByTestId } = render(
      <ToggleGroup
        testID='group'
        accessibilityLabel='My Group'
        accessibilityHint='Groups toggles'
      >
        <Toggle value='a'>
          <Text>A</Text>
        </Toggle>
      </ToggleGroup>,
    );

    const group = getByTestId('group');
    expect(group.props.accessibilityLabel).toBe('My Group');
  });
});
