import * as React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Root as Button } from './button';

describe('Button.Root', () => {
  const defaultHint = 'Triggers an action';

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
    it('merges button accessibility props onto the child component', () => {
      const { getByTestId } = render(
        <Button asChild disabled accessibilityHint='Custom Hint'>
          <View
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
    });

    it('chains event handlers between Button and the child component', () => {
      const rootPress = jest.fn();
      const childPress = jest.fn();

      const { getByTestId } = render(
        <Button asChild onPress={rootPress} accessibilityHint={defaultHint}>
          <Text testID='text-child' onPress={childPress}>
            Click Me
          </Text>
        </Button>,
      );

      fireEvent.press(getByTestId('text-child'));

      expect(rootPress).toHaveBeenCalledTimes(1);
      expect(childPress).toHaveBeenCalledTimes(1);
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
          <View testID='child-view' />
        </Button>,
      );

      expect(ref.current).toBeDefined();
      expect(ref.current?.props.testID).toBe('child-view');
    });
  });
});
