import * as React from 'react';
import { Text, View } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './button';

describe('Button', () => {
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
      expect(button.props.accessibilityActions).toEqual(
        expect.arrayContaining([{ name: 'activate' }]),
      );
    });

    it('defaults accessibilityHint when none is provided', () => {
      const { getByRole } = render(
        <Button>
          <Text>Default Hint</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.accessibilityHint).toBe('Activates the button');
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

    it('keeps focusable when focusableWhenDisabled is true', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(true);
      expect(button.props.accessibilityState).toEqual({ disabled: true });

      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('sets default tabIndex based on focusability', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={defaultHint}>
          <Text>Focusable</Text>
        </Button>,
      );

      const button = getByRole('button');
      expect(button.props.tabIndex).toBe(0);

      rerender(
        <Button disabled accessibilityHint={defaultHint}>
          <Text>Not Focusable</Text>
        </Button>,
      );

      const disabledButton = getByRole('button');
      expect(disabledButton.props.tabIndex).toBe(-1);
    });

    it('allows overriding tabIndex and aria-disabled', () => {
      const webOverrides = {
        tabIndex: -1 as const,
        'aria-disabled': false,
      };

      const { getByRole } = render(
        <Button
          disabled
          accessibilityHint={defaultHint}
          {...(webOverrides as any)}
        >
          <Text>Overrides</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.tabIndex).toBe(-1);
      expect(button.props['aria-disabled']).toBeUndefined();
    });
  });

  describe('Native Render Props (children as function)', () => {
    it('supports React Native press state via render props', () => {
      const { getByText } = render(
        <Button accessibilityHint={defaultHint}>
          {({ pressed }) => (
            <Text>{pressed ? 'Pressed State' : 'Normal State'}</Text>
          )}
        </Button>,
      );

      // Verifies the function is executed and renders the correct initial state
      expect(getByText('Normal State')).toBeDefined();
    });
  });

  describe('Hardware Keyboard Accessibility', () => {
    it('triggers onPress for keyboard/gamepad/TV select keys', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      const activationKeys = [
        ' ',
        'Enter',
        'Spacebar',
        'Space',
        'Select',
        'Return',
        'OK',
        'Accept',
      ];

      activationKeys.forEach((key) => {
        fireEvent(button, 'keyPress', { nativeEvent: { key } });
      });

      expect(onPressMock).toHaveBeenCalledTimes(activationKeys.length);
    });

    it('ignores hardware keyboard events when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Hardware Keyboard & Focus Management', () => {
    describe('Multi-button focus order', () => {
      it('assigns tabIndex=0 to enabled buttons and tabIndex=-1 to disabled', () => {
        const { getAllByRole } = render(
          <>
            <Button accessibilityHint={defaultHint}>
              <Text>Button A</Text>
            </Button>
            <Button accessibilityHint={defaultHint}>
              <Text>Button B</Text>
            </Button>
            <Button disabled accessibilityHint={defaultHint}>
              <Text>Button C</Text>
            </Button>
          </>,
        );

        const buttons = getAllByRole('button');

        expect(buttons[0].props.tabIndex).toBe(0);
        expect(buttons[0].props.focusable).toBe(true);
        expect(buttons[1].props.tabIndex).toBe(0);
        expect(buttons[1].props.focusable).toBe(true);
        expect(buttons[2].props.tabIndex).toBe(-1);
        expect(buttons[2].props.focusable).toBe(false);
      });

      it('keeps tabIndex=0 and focusable=true for focusableWhenDisabled button in a group', () => {
        const { getAllByRole } = render(
          <>
            <Button accessibilityHint={defaultHint}>
              <Text>Button A</Text>
            </Button>
            <Button
              disabled
              focusableWhenDisabled
              accessibilityHint={defaultHint}
            >
              <Text>Loading</Text>
            </Button>
            <Button disabled accessibilityHint={defaultHint}>
              <Text>Button C</Text>
            </Button>
          </>,
        );

        const buttons = getAllByRole('button');

        // Enabled: fully focusable
        expect(buttons[0].props.tabIndex).toBe(0);
        expect(buttons[0].props.focusable).toBe(true);

        // Disabled + focusableWhenDisabled: focusable but blocked
        expect(buttons[1].props.tabIndex).toBe(0);
        expect(buttons[1].props.focusable).toBe(true);
        expect(buttons[1].props.accessibilityState).toEqual({ disabled: true });

        // Disabled: removed from focus order
        expect(buttons[2].props.tabIndex).toBe(-1);
        expect(buttons[2].props.focusable).toBe(false);
      });

      it('fires onPress only on the button that receives the key event', () => {
        const onPressA = jest.fn();
        const onPressB = jest.fn();
        const onPressC = jest.fn();

        const { getAllByRole } = render(
          <>
            <Button onPress={onPressA} accessibilityHint={defaultHint}>
              <Text>Button A</Text>
            </Button>
            <Button onPress={onPressB} accessibilityHint={defaultHint}>
              <Text>Button B</Text>
            </Button>
            <Button onPress={onPressC} accessibilityHint={defaultHint}>
              <Text>Button C</Text>
            </Button>
          </>,
        );

        const buttons = getAllByRole('button');

        fireEvent(buttons[1], 'keyPress', { nativeEvent: { key: 'Enter' } });

        expect(onPressA).not.toHaveBeenCalled();
        expect(onPressB).toHaveBeenCalledTimes(1);
        expect(onPressC).not.toHaveBeenCalled();
      });

      it('each button in a group activates independently via keyboard', () => {
        const onPressA = jest.fn();
        const onPressB = jest.fn();

        const { getAllByRole } = render(
          <>
            <Button onPress={onPressA} accessibilityHint={defaultHint}>
              <Text>Button A</Text>
            </Button>
            <Button onPress={onPressB} accessibilityHint={defaultHint}>
              <Text>Button B</Text>
            </Button>
          </>,
        );

        const buttons = getAllByRole('button');

        fireEvent(buttons[0], 'keyPress', { nativeEvent: { key: ' ' } });
        fireEvent(buttons[1], 'keyPress', { nativeEvent: { key: 'Enter' } });

        expect(onPressA).toHaveBeenCalledTimes(1);
        expect(onPressB).toHaveBeenCalledTimes(1);
      });

      it('updates tabIndex when a button transitions from enabled to disabled', () => {
        const { getByRole, rerender } = render(
          <Button accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        expect(getByRole('button').props.tabIndex).toBe(0);
        expect(getByRole('button').props.focusable).toBe(true);

        rerender(
          <Button disabled accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        expect(getByRole('button').props.tabIndex).toBe(-1);
        expect(getByRole('button').props.focusable).toBe(false);
      });

      it('preserves tabIndex=0 when transitioning to disabled with focusableWhenDisabled', () => {
        const { getByRole, rerender } = render(
          <Button focusableWhenDisabled accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        expect(getByRole('button').props.tabIndex).toBe(0);

        rerender(
          <Button
            disabled
            focusableWhenDisabled
            accessibilityHint={defaultHint}
          >
            <Text>Button</Text>
          </Button>,
        );

        expect(getByRole('button').props.tabIndex).toBe(0);
        expect(getByRole('button').props.focusable).toBe(true);
        expect(getByRole('button').props.accessibilityState).toEqual({
          disabled: true,
        });
      });
    });

    describe('Non-activation key filtering', () => {
      it('does not trigger onPress for navigation and modifier keys', () => {
        const onPressMock = jest.fn();
        const { getByRole } = render(
          <Button onPress={onPressMock} accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        const button = getByRole('button');

        const nonActivationKeys = [
          'Tab',
          'Shift',
          'Control',
          'Alt',
          'Meta',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'Escape',
          'Backspace',
          'Delete',
          'Home',
          'End',
          'PageUp',
          'PageDown',
          'F1',
          'F5',
          'F12',
        ];

        nonActivationKeys.forEach((key) => {
          fireEvent(button, 'keyPress', { nativeEvent: { key } });
        });

        expect(onPressMock).not.toHaveBeenCalled();
      });

      it('still forwards all key events to the onKeyPress callback regardless of key type', () => {
        const onKeyPressMock = jest.fn();
        const { getByRole } = render(
          <Button onKeyPress={onKeyPressMock} accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        const button = getByRole('button');

        fireEvent(button, 'keyPress', { nativeEvent: { key: 'Tab' } });
        fireEvent(button, 'keyPress', { nativeEvent: { key: 'ArrowDown' } });
        fireEvent(button, 'keyPress', { nativeEvent: { key: 'Enter' } });

        // All three key events are forwarded to onKeyPress
        expect(onKeyPressMock).toHaveBeenCalledTimes(3);
      });

      it('D-pad navigation keys (TV/gamepad) do not activate the button', () => {
        const onPressMock = jest.fn();
        const { getByRole } = render(
          <Button onPress={onPressMock} accessibilityHint={defaultHint}>
            <Text>Button</Text>
          </Button>,
        );

        const button = getByRole('button');

        // D-pad navigation should move focus, not activate
        const dpadKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        dpadKeys.forEach((key) => {
          fireEvent(button, 'keyPress', { nativeEvent: { key } });
        });

        expect(onPressMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('focusableWhenDisabled', () => {
    it('blocks all keyboard activation keys when disabled even if focusable', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const button = getByRole('button');

      expect(button.props.focusable).toBe(true);

      const activationKeys = [
        ' ',
        'Enter',
        'Spacebar',
        'Space',
        'Select',
        'Return',
        'OK',
        'Accept',
      ];
      activationKeys.forEach((key) => {
        fireEvent(button, 'keyPress', { nativeEvent: { key } });
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('blocks accessibility actions when disabled even if focusable', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('restores full interaction when re-enabled after disabled + focusableWhenDisabled', () => {
      const onPressMock = jest.fn();
      const { getByRole, rerender } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Loading</Text>
        </Button>,
      );

      const loadingButton = getByRole('button');
      expect(loadingButton.props.focusable).toBe(true);
      expect(loadingButton.props.accessibilityState).toEqual({
        disabled: true,
      });

      fireEvent(loadingButton, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).not.toHaveBeenCalled();

      rerender(
        <Button
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Submit</Text>
        </Button>,
      );

      const activeButton = getByRole('button');
      expect(activeButton.props.focusable).toBe(true);
      expect(activeButton.props.accessibilityState).toEqual({
        disabled: false,
      });

      fireEvent(activeButton, 'keyPress', { nativeEvent: { key: 'Enter' } });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('does not affect onPress when button is enabled with focusableWhenDisabled set', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          focusableWhenDisabled
          onPress={onPressMock}
          accessibilityHint={defaultHint}
        >
          <Text>Submit</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent.press(button);
      fireEvent(button, 'keyPress', { nativeEvent: { key: 'Enter' } });

      expect(onPressMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('Focus Management', () => {
    it('assigns correct focusable and tabIndex across a mixed group of buttons', () => {
      const { getAllByRole } = render(
        <>
          <Button accessibilityHint='Normal button'>
            <Text>Normal</Text>
          </Button>
          <Button disabled accessibilityHint='Disabled button'>
            <Text>Disabled</Text>
          </Button>
          <Button
            disabled
            focusableWhenDisabled
            accessibilityHint='Loading button'
          >
            <Text>Loading</Text>
          </Button>
        </>,
      );

      const [normal, disabled, loading] = getAllByRole('button');

      // Normal: interactive and in tab order
      expect(normal.props.focusable).toBe(true);
      expect(normal.props.tabIndex).toBe(0);
      expect(normal.props.accessibilityState).toEqual({ disabled: false });

      // Disabled: removed from focus entirely
      expect(disabled.props.focusable).toBe(false);
      expect(disabled.props.tabIndex).toBe(-1);
      expect(disabled.props.accessibilityState).toEqual({ disabled: true });

      // Loading (focusableWhenDisabled): stays in tab order but reports disabled
      expect(loading.props.focusable).toBe(true);
      expect(loading.props.tabIndex).toBe(0);
      expect(loading.props.accessibilityState).toEqual({ disabled: true });
    });

    it('maintains focus order in a form with a loading submit button', () => {
      // Simulates a form mid-submission: inputs are disabled, submit is loading
      const { getAllByRole } = render(
        <>
          <Button accessibilityHint='Go to step 1'>
            <Text>Step 1</Text>
          </Button>
          <Button accessibilityHint='Go to step 2'>
            <Text>Step 2</Text>
          </Button>
          <Button disabled accessibilityHint='Step 3 unavailable'>
            <Text>Step 3</Text>
          </Button>
          <Button
            disabled
            focusableWhenDisabled
            accessibilityHint='Submitting form'
          >
            <Text>Submitting...</Text>
          </Button>
        </>,
      );

      const [step1, step2, step3, submit] = getAllByRole('button');

      // Step 1 + 2 are interactive
      expect(step1.props.focusable).toBe(true);
      expect(step1.props.tabIndex).toBe(0);
      expect(step2.props.focusable).toBe(true);
      expect(step2.props.tabIndex).toBe(0);

      // Step 3 is disabled and hidden from focus order
      expect(step3.props.focusable).toBe(false);
      expect(step3.props.tabIndex).toBe(-1);

      // Submit is loading — stays focusable so screen readers can announce state
      expect(submit.props.focusable).toBe(true);
      expect(submit.props.tabIndex).toBe(0);
      expect(submit.props.accessibilityState).toEqual({ disabled: true });
    });

    it('does not lose focusability when toggling between enabled and focusableWhenDisabled', () => {
      const { getByRole, rerender } = render(
        <Button accessibilityHint={defaultHint}>
          <Text>Button</Text>
        </Button>,
      );

      // Enabled: fully focusable
      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);

      // Becomes disabled normally: loses focus
      rerender(
        <Button disabled accessibilityHint={defaultHint}>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(false);
      expect(getByRole('button').props.tabIndex).toBe(-1);

      // Becomes disabled+focusableWhenDisabled (loading): retains focus
      rerender(
        <Button disabled focusableWhenDisabled accessibilityHint={defaultHint}>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);

      // Back to enabled: still focusable
      rerender(
        <Button accessibilityHint={defaultHint}>
          <Text>Button</Text>
        </Button>,
      );
      expect(getByRole('button').props.focusable).toBe(true);
      expect(getByRole('button').props.tabIndex).toBe(0);
    });
  });

  describe('Accessibility Actions', () => {
    it('triggers onPress when activate accessibility action is fired', () => {
      const onPressMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();

      const { getByRole } = render(
        <Button
          onPress={onPressMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityHint={defaultHint}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).toHaveBeenCalledTimes(1);
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });

    it('ignores accessibility actions when disabled', () => {
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button disabled onPress={onPressMock} accessibilityHint={defaultHint}>
          <Text>Disabled Action</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Ref Forwarding', () => {
    it('forwards ref to the native Pressable wrapper', () => {
      const ref = React.createRef<View>();

      render(
        <Button ref={ref} accessibilityHint={defaultHint}>
          <Text>Ref Test</Text>
        </Button>,
      );

      // In React Native testing library, refs point to the native host component
      expect(ref.current).toBeDefined();
    });
  });
});
