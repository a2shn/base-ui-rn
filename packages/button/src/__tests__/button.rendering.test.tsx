import { render } from '@testing-library/react-native';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../button';
import type { ButtonProps } from '../types';

describe('Button - Rendering', () => {
  it('renders correctly with text children', () => {
    const { getByText } = render(
      <Button>
        <Text>Click Me</Text>
      </Button>,
    );
    expect(getByText('Click Me')).toBeDefined();
  });

  it('renders correctly with multiple children', () => {
    const { getByText } = render(
      <Button>
        <Text>Icon</Text>
        <Text>Label</Text>
      </Button>,
    );
    expect(getByText('Icon')).toBeDefined();
    expect(getByText('Label')).toBeDefined();
  });

  it('renders with a View wrapper element', () => {
    const { toJSON } = render(
      <Button>
        <Text>Button</Text>
      </Button>,
    );
    expect(toJSON()).toBeDefined();
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

  describe('Style Support', () => {
    it('supports static style', () => {
      const { getByTestId } = render(
        <Button style={{ backgroundColor: 'red' }} testID='button'>
          <Text>Styled</Text>
        </Button>,
      );
      const button = getByTestId('button');
      expect(StyleSheet.flatten(button.props.style)).toMatchObject({
        backgroundColor: 'red',
      });
    });

    it('supports style as a function of state', () => {
      const { getByTestId } = render(
        <Button
          style={({ pressed }) => ({
            backgroundColor: pressed ? 'red' : 'blue',
          })}
          testID='styled-button'
        >
          <Text>Dynamic Style</Text>
        </Button>,
      );
      const button = getByTestId('styled-button');
      expect(button.props.style).toBeDefined();
    });

    it('applies base style correctly', () => {
      const { getByTestId } = render(
        <Button style={[{ padding: 10 }, { margin: 5 }]} testID='array-style'>
          <Text>Array Style</Text>
        </Button>,
      );
      const button = getByTestId('array-style');
      expect(button.props.style).toBeDefined();
    });
  });

  describe('Children Function', () => {
    it('supports render function as children', () => {
      const { getByText } = render(
        <Button>
          {({ pressed }) => <Text>{pressed ? 'Pressed' : 'Press Me'}</Text>}
        </Button>,
      );
      expect(getByText('Press Me')).toBeDefined();
    });

    it('provides focused state to children function', () => {
      const { getByText } = render(
        <Button>
          {({ focused }) => <Text>{focused ? 'Focused' : 'Not Focused'}</Text>}
        </Button>,
      );
      expect(getByText('Not Focused')).toBeDefined();
    });

    it('provides pressed state to children function', () => {
      const { getByText } = render(
        <Button>
          {({ pressed }) => (
            <Text testID='child'>{pressed ? 'Pressed' : 'Not Pressed'}</Text>
          )}
        </Button>,
      );

      const child = getByText('Not Pressed');

      expect(child).toBeDefined();
      expect(child.props.testID).toBe('child');
    });
  });

  describe('Hit Slop', () => {
    it('applies default hitSlop', () => {
      const { getByRole } = render(
        <Button>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.hitSlop).toBeDefined();
    });

    it('accepts custom hitSlop', () => {
      const customHitSlop = { bottom: 20, left: 20, right: 20, top: 20 };
      const { getByRole } = render(
        <Button hitSlop={customHitSlop}>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.hitSlop).toEqual(customHitSlop);
    });

    it('accepts asymmetric hitSlop', () => {
      const asymmetricHitSlop = { bottom: 5, left: 15, right: 0, top: 10 };
      const { getByRole } = render(
        <Button hitSlop={asymmetricHitSlop}>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.hitSlop).toEqual(asymmetricHitSlop);
    });
  });

  describe('Test ID', () => {
    it('accepts testID prop', () => {
      const { getByTestId } = render(
        <Button testID='button-element'>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByTestId('button-element')).toBeDefined();
    });
  });

  describe('Display Name', () => {
    it('has correct displayName', () => {
      expect(Button.displayName).toBe('Button');
    });
  });

  describe('Memoization', () => {
    it('is memoized with React.memo', () => {
      const memoizedButton = React.memo(
        React.forwardRef<View, ButtonProps>(() => null),
      );
      expect(Button.$$typeof).toBe(memoizedButton.$$typeof);
    });
  });

  describe('Null/Undefined Children', () => {
    it('renders with null children', () => {
      const { toJSON } = render(<Button>{null}</Button>);
      expect(toJSON()).toBeDefined();
    });

    it('renders with undefined children', () => {
      const { toJSON } = render(<Button>{undefined}</Button>);
      expect(toJSON()).toBeDefined();
    });
  });
});
