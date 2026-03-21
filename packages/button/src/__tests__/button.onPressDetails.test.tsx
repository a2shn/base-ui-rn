import { DEFAULT_HINT } from '@base-ui-rn/test-utils';
import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { Button } from '../button';

describe('Button - onPressDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Source Tracking', () => {
    it('calls onPressedChange with source "press" when button is pressed', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onPressedChangeMock}
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
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      // Test Space
      fireEvent(button, 'keyDown', { nativeEvent: { key: ' ' } });
      expect(onPressedChangeMock).toHaveBeenLastCalledWith({
        source: 'keyboard',
      });

      // Test Enter
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressedChangeMock).toHaveBeenLastCalledWith({
        source: 'keyboard',
      });

      expect(onPressedChangeMock).toHaveBeenCalledTimes(2);
    });

    it('calls onPressedChange with source "accessibilityAction" when accessibility action is triggered', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

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
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onPressedChangeMock}
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
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onPressedChangeMock}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not call onPressedChange when disabled from accessibility action', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          onPressedChange={onPressedChangeMock}
        >
          <Text>Disabled Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });

    it('does not call onPressedChange when disabled with focusableWhenDisabled, regardless of source', () => {
      const onPressedChangeMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          disabled
          focusableWhenDisabled
          onPressedChange={onPressedChangeMock}
        >
          <Text>Loading Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent.press(button);
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressedChangeMock).not.toHaveBeenCalled();
    });
  });

  describe('onPressedChange with onPress Interaction', () => {
    it('calls onPressedChange and onPress together for press source', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onPress={onPressMock}
          onPressedChange={onPressedChangeMock}
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
          accessibilityHint={DEFAULT_HINT}
          onPress={onPressMock}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'keyboard' });
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('calls onPressedChange but not onPress for accessibilityAction source', () => {
      const onPressedChangeMock = jest.fn();
      const onPressMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onPress={onPressMock}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

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
          accessibilityHint={DEFAULT_HINT}
          onPress={onPressMock}
          onPressedChange={onPressedChangeMock}
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
          accessibilityHint={DEFAULT_HINT}
          onPressedChange={onPressedChangeMock}
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
      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });
      expect(onPressedChangeMock).toHaveBeenNthCalledWith(2, {
        source: 'keyboard',
      });

      // Accessibility action activation
      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });
      expect(onPressedChangeMock).toHaveBeenNthCalledWith(3, {
        source: 'accessibilityAction',
      });

      expect(onPressedChangeMock).toHaveBeenCalledTimes(3);
    });
  });

  describe('onPressedChange with other callbacks', () => {
    it('fires onPressedChange and onKeyDown both for keyboard events', () => {
      const onPressedChangeMock = jest.fn();
      const onKeyDownMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityHint={DEFAULT_HINT}
          onKeyDown={onKeyDownMock}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Keyboard Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onPressedChangeMock).toHaveBeenCalledWith({ source: 'keyboard' });
      expect(onKeyDownMock).toHaveBeenCalledTimes(1);
    });

    it('fires onPressedChange and onAccessibilityAction both for accessibility events', () => {
      const onPressedChangeMock = jest.fn();
      const onAccessibilityActionMock = jest.fn();
      const { getByRole } = render(
        <Button
          accessibilityActions={[{ name: 'activate' }]}
          accessibilityHint={DEFAULT_HINT}
          onAccessibilityAction={onAccessibilityActionMock}
          onPressedChange={onPressedChangeMock}
        >
          <Text>Action Button</Text>
        </Button>,
      );

      const button = getByRole('button');

      fireEvent(button, 'accessibilityAction', {
        nativeEvent: { actionName: 'activate' },
      });

      expect(onPressedChangeMock).toHaveBeenCalledWith({
        source: 'accessibilityAction',
      });
      expect(onAccessibilityActionMock).toHaveBeenCalledTimes(1);
    });
  });
});
