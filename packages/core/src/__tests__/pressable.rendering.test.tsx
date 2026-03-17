import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: Rendering', () => {
  it('should render correctly with children', () => {
    const { getByText } = render(
      <PressableWithKeyPress>
        <Text>Hello</Text>
      </PressableWithKeyPress>,
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  it('should render correctly with basic props', () => {
    const { getByTestId } = render(
      <PressableWithKeyPress
        testID='test-pressable'
        accessibilityLabel='Test'
        accessibilityHint='A test hint'
      >
        <Text>Click Me</Text>
      </PressableWithKeyPress>,
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable).toBeTruthy();
    expect(pressable.props.accessibilityLabel).toBe('Test');
  });

  it('should apply styles correctly', () => {
    const customStyle = { backgroundColor: 'blue', padding: 10 };
    const { getByTestId } = render(
      <PressableWithKeyPress testID='styled-pressable' style={customStyle}>
        <Text>Styled</Text>
      </PressableWithKeyPress>,
    );
    const pressable = getByTestId('styled-pressable');
    // React Native merges styles, so we expect the props.style to contain the custom style properties.
    expect(pressable.props.style).toEqual(expect.objectContaining(customStyle));
  });
});
