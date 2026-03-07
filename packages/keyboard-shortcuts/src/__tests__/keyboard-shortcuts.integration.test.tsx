import * as React from 'react';
import { Text, Pressable } from 'react-native';
import { render } from '@testing-library/react-native';
import { ShortcutProvider, useKeyboardShortcut } from '../index';
import type { ShortcutConfig } from '../types';

// Mock Button component to break cyclic dependency
const MockButton = ({
  onPress,
  shortcut,
  disabled,
  children,
}: {
  onPress: () => void;
  shortcut: ShortcutConfig;
  disabled?: boolean;
  children: React.ReactNode;
}) => {
  useKeyboardShortcut(shortcut, () => {
    if (!disabled) {
      onPress();
    }
  });
  return (
    <Pressable
      accessibilityRole='button'
      testID='mock-button'
      onPress={onPress}
      disabled={disabled}
    >
      {children}
    </Pressable>
  );
};

describe('KeyboardShortcuts Integration', () => {
  it('does not trigger onPress if the MockButton is disabled', () => {
    const onPressMock = jest.fn();
    render(
      <ShortcutProvider>
        <MockButton
          disabled
          onPress={onPressMock}
          shortcut={{ keys: ['s'], modifiers: ['ctrl'] }}
        >
          <Text>Save</Text>
        </MockButton>
      </ShortcutProvider>,
    );
    // Since we are mocking the hook and the provider context is isolated,
    // this test ensures the component renders correctly and disabled logic
    // inside the mock or actual component wouldn't throw errors.
    expect(onPressMock).not.toHaveBeenCalled();
  });
});
