import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from '../index';

const ACTIVATION_KEYS = [
  'Enter',
  ' ',
  'Spacebar',
  'Space',
  'Select',
  'Return',
  'OK',
  'Accept',
];

describe('Accordion - Keyboard Interaction', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Activation Keys', () => {
    it('toggles panel when Enter is pressed', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger testID='trigger'>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onValueChange).toHaveBeenCalledWith('item-1', {
        reason: 'toggle',
        value: 'item-1',
      });
    });

    it('toggles panel when Space is pressed', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: ' ' } });

      expect(onValueChange).toHaveBeenCalledWith('item-1', {
        reason: 'toggle',
        value: 'item-1',
      });
    });

    it('toggles for all activation keys', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');

      ACTIVATION_KEYS.forEach((key) => {
        fireEvent(trigger, 'keyDown', { nativeEvent: { key } });
      });

      expect(onValueChange).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('ignores keyboard activation when disabled', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem disabled value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Enter' } });

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('ignores non-activation keys', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Tab' } });
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'ArrowDown' } });
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Escape' } });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('onKeyDown Callback', () => {
    it('forwards key events to onKeyDown callback', () => {
      const onKeyDown = jest.fn();
      const { getByText } = render(
        <AccordionRoot>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger onKeyDown={onKeyDown}>
                <Text>Item 1</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 1</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger = getByText('Item 1');
      fireEvent(trigger, 'keyDown', { nativeEvent: { key: 'Tab' } });

      expect(onKeyDown).toHaveBeenCalledTimes(1);
    });
  });
});
