import * as React from 'react';
import { Text, View, Pressable } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Root as Button } from './button';

describe('Button.Root', () => {
  const defaultHint = 'Triggers an action';

  // Suppress and track console warnings for specific tests
  const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  describe('Standard Rendering', () => {
    it('renders as a Pressable by default with base accessibility', () => {
      const { getByRole } = render(
        <Button accessibilityHint={defaultHint}>
          <Text>Click Me</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button).toBeDefined();
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityHint).toBe(defaultHint);
      expect(button.props.focusable).toBe(true);
      expect(button.props.accessibilityState).toEqual({ disabled: false });
    });

    it('triggers onPress when interacted with', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Click Me</Text>
        </Button>,
      );

      fireEvent.press(getByRole('button'));

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('applies disabled state correctly across all accessibility layers', () => {
      const { getByRole } = render(
        <Button disabled accessibilityHint={defaultHint}>
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(false);
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });
  });

  describe('asChild Polymorphism', () => {
    it('merges button accessibility props onto the child Pressable component', () => {
      const { getByTestId } = render(
        <Button asChild disabled accessibilityHint='Custom Hint'>
          <Pressable
            testID='custom-child'
            accessibilityLabel='Custom Label'
            accessibilityHint='Custom Hint'
          />
        </Button>,
      );

      const child = getByTestId('custom-child');

      expect(child.props.accessibilityRole).toBe('button');
      expect(child.props.accessibilityLabel).toBe('Custom Label');
      expect(child.props.accessibilityHint).toBe('Custom Hint');
      expect(child.props.focusable).toBe(false);
      expect(child.props.accessibilityState).toEqual({ disabled: true });
      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('chains event handlers between Button and the child component', () => {
      const rootPress = jest.fn();
      const childPress = jest.fn();

      const { getByTestId } = render(
        <Button asChild onPress={rootPress} accessibilityHint={defaultHint}>
          <Pressable
            accessibilityRole='button'
            testID='pressable-child'
            onPress={childPress}
          >
            <Text>Click Me</Text>
          </Pressable>
        </Button>,
      );

      fireEvent.press(getByTestId('pressable-child'));

      expect(rootPress).toHaveBeenCalledTimes(1);
      expect(childPress).toHaveBeenCalledTimes(1);
    });

    it('warns but functions when using asChild with a View component', () => {
      const onPressMock = jest.fn();

      const { getByTestId } = render(
        <Button asChild onPress={onPressMock} accessibilityHint={defaultHint}>
          <View testID='view-child'>
            <Text>Interaction Test</Text>
          </View>
        </Button>,
      );

      const child = getByTestId('view-child');

      // Verify it didn't crash and applied the responder system
      fireEvent.press(child);
      expect(onPressMock).toHaveBeenCalledTimes(1);

      // Verify the Dev-only warning was triggered
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[Base UI RN] <Button.Root asChild> was used with a non-Pressable child. While we inject touch support, generic components may not provide a full native keyboard focus experience. Consider using <Pressable> as the direct child.',
        ),
      );
    });

    it('warns when using asChild with a Text component', () => {
      render(
        <Button asChild accessibilityHint={defaultHint}>
          <Text>Warning Test</Text>
        </Button>,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          '[Base UI RN] <Button.Root asChild> was used with a non-Pressable child. While we inject touch support, generic components may not provide a full native keyboard focus experience. Consider using <Pressable> as the direct child.',
        ),
      );
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the standard Pressable wrapper', () => {
      const ref = React.createRef<View>();

      render(
        <Button ref={ref} accessibilityHint={defaultHint}>
          <Text>Ref Test</Text>
        </Button>,
      );

      expect(ref.current).toBeDefined();
    });

    it('forwards ref to the underlying child component when using asChild', () => {
      const ref = React.createRef<View>();

      render(
        <Button asChild ref={ref} accessibilityHint={defaultHint}>
          <Pressable accessibilityRole='button' testID='child-pressable' />
        </Button>,
      );

      expect(ref.current).toBeDefined();
      expect(ref.current?.props.testID).toBe('child-pressable');
    });
  });
});
