import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';
import {
  DEFAULT_HINT,
  fireKeyPress,
  fireAccessibilityAction,
} from '@base-ui-rn/test-utils';

describe('Button - onPressDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Source Tracking', () => {
    it('calls onPressedChange with source "press" when button is pressed', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Press Me</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'press' });
      expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
    });

    it('calls onPressedChange with source "keyboard" when activation key is pressed', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Test Space
      fireKeyPress(button, ' ');
      expect(onPressedChangeMock).toHaveBeenLastCalledWith({
        source: 'keyboard',
      });

      // Test Enter
      fireKeyPress(button, 'Enter');
      expect(onPressedChangeMock).toHaveBeenLastCalledWith({
        source: 'keyboard',
      });

      expect(onPressedChangeMock).toHaveBeenCalledTimes(2);
    });

    it('calls onPressedChange with source "accessibilityAction" when accessibility action is triggered', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        //eslint-disable-next-line react-native-a11y/has-valid-accessibility-actions
        <Button
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireAccessibilityAction(button, 'activate');

      expect(onPressedChangeMock).toHaveBeenCalledWith({
        source: 'accessibilityAction',
      });
      expect(onPressedChangeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPressedChange with Disabled State', () => {
    it('does not call onPressedChange when disabled from press', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent.press(button);
      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not call onPressedChange when disabled from keyboard', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Enter');
      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not call onPressedChange when disabled from accessibility action', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireAccessibilityAction(button, 'activate');
      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not call onPressedChange when disabled with focusableWhenDisabled, regardless of source', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          disabled
          focusableWhenDisabled
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent.press(button);
      fireKeyPress(button, 'Enter');
      fireAccessibilityAction(button, 'activate');

      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('onPressedChange with onPress Interaction', () => {
    it('calls onPressedChange and onPress together for press source', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Both Callbacks</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'press' });
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('calls onPressedChange but not onPress for keyboard source', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireKeyPress(button, 'Enter');

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'keyboard' });
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('calls onPressedChange but not onPress for accessibilityAction source', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();
      const { getByRole } = render(
        //eslint-disable-next-line react-native-a11y/has-valid-accessibility-actions
        <Button
          onPressedChange={onPressedChangeMock}
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireAccessibilityAction(button, 'activate');

      expect(onPressedChangeMock).toHaveBeenCalledWith({
        source: 'accessibilityAction',
      });
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('fires onPressedChange before onPress for press source', () => {
      const callOrder: string[] = [];
      const onPressedChangeMock = jest.fn(() =>
        callOrder.push('onPressedChange'),
      );
      const onPressMock = jest.fn(() => callOrder.push('onPress'));
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          onPress={onPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Order Test</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent.press(button);

      expect(callOrder).toEqual(['onPressedChange', 'onPress']);
    });
  });

  describe('Multiple Activation Sources', () => {
    it('differentiates between multiple activation sources in sequence', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Multi-Source Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Press activation
      fireEvent.press(button);
      expect(onPressedChangeMock).toHaveBeenNthCalledWith(1, {
        source: 'press',
      });

      // Keyboard activation
      fireKeyPress(button, 'Enter');
      expect(onPressedChangeMock).toHaveBeenNthCalledWith(2, {
        source: 'keyboard',
      });

      // Accessibility action activation
      fireAccessibilityAction(button, 'activate');
      expect(onPressedChangeMock).toHaveBeenNthCalledWith(3, {
        source: 'accessibilityAction',
      });

      expect(onPressedChangeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('onPressedChange with other callbacks', () => {
    it('fires onPressedChange and onKeyPress both for keyboard events', () => {
      const onPressedChangeMock = jest.fn();
      const onKeyPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          onPressedChange={onPressedChangeMock}
          onKeyPress={onKeyPressMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireKeyPress(button, 'Enter');

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'keyboard' });
      expect(onKeyPressMock).toHaveBeenCalledTimes(1);
    });

    it('fires onPressedChange and onAccessibilityAction both for accessibility events', () => {
      const onPressedChangeMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();
      const { getByRole } = render(
        //eslint-disable-next-line react-native-a11y/has-valid-accessibility-actions
        <Button
          onPressedChange={onPressedChangeMock}
          onAccessibilityAction={onAccessibilityActionMock}
          accessibilityHint={DEFAULT_HINT}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireAccessibilityAction(button, 'activate');

      expect(onPressedChangeMock).toHaveBeenCalledWith({
        source: 'accessibilityAction',
      });
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });
  });
});
