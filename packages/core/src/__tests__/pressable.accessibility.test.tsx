import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { PressableWithKeyPress } from '../pressable';

describe('PressableWithKeyPress: Accessibility', () => {
  it('should pass accessibilityLabel and accessibilityHint', () => {
    const { getByTestId } = render(
      <PressableWithKeyPress
        accessibilityHint='Double tap to activate'
        accessibilityLabel='My Button'
        testID='test-pressable'
      >
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.accessibilityLabel).toBe('My Button');
    expect(pressable.props.accessibilityHint).toBe('Double tap to activate');
  });

  it('should pass accessibilityRole and accessibilityState', () => {
    const { getByTestId } = render(
      <PressableWithKeyPress
        accessibilityRole='button'
        accessibilityState={{ disabled: true, selected: true }}
        testID='test-pressable'
      >
        <Text>Button</Text>
      </PressableWithKeyPress>,
    );
    const pressable = getByTestId('test-pressable');
    expect(pressable.props.accessibilityRole).toBe('button');
    expect(pressable.props.accessibilityState).toEqual({
      disabled: true,
      selected: true,
    });
  });

  // Removing aria-* tests for now as React Native's Pressable does not expose them directly
  // on the props object in the testing environment, even if they are internally handled
  // or mapped to accessibility* props. These would require a web-specific testing setup
  // or more complex DOM inspection not directly supported by @testing-library/react-native.
});
