import * as React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
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
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'Enter' } });

      expect(onValueChange).toHaveBeenCalledWith('item-1', {
        value: 'item-1',
        reason: 'toggle',
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
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: ' ' } });

      expect(onValueChange).toHaveBeenCalledWith('item-1', {
        value: 'item-1',
        reason: 'toggle',
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
        fireEvent(trigger, 'keyPress', { nativeEvent: { key } });
      });

      expect(onValueChange).toHaveBeenCalledTimes(ACTIVATION_KEYS.length);
    });

    it('ignores keyboard activation when disabled', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot onValueChange={onValueChange}>
          <AccordionItem value='item-1' disabled>
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
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'Enter' } });

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
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'Tab' } });
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'ArrowDown' } });
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'Escape' } });

      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('onKeyPress Callback', () => {
    it('forwards key events to onKeyPress callback', () => {
      const onKeyPress = jest.fn();
      const { getByText } = render(
        <AccordionRoot>
          <AccordionItem value='item-1'>
            <AccordionHeader>
              <AccordionTrigger onKeyPress={onKeyPress}>
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
      fireEvent(trigger, 'keyPress', { nativeEvent: { key: 'Tab' } });

      expect(onKeyPress).toHaveBeenCalledTimes(1);
    });
  });
});
