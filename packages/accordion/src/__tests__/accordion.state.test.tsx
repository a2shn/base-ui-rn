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

describe('Accordion - State Management', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled State', () => {
    it('toggles panel when trigger is pressed', () => {
      const { getByText, queryByText } = render(
        <AccordionRoot>
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

      expect(queryByText('Content 1')).toBeNull();

      const trigger = getByText('Item 1');
      fireEvent.press(trigger);

      expect(getByText('Content 1')).toBeDefined();
    });

    it('closes panel when already open', () => {
      const { getByText, queryByText } = render(
        <AccordionRoot defaultValue='item-1'>
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

      expect(getByText('Content 1')).toBeDefined();

      const trigger = getByText('Item 1');
      fireEvent.press(trigger);

      expect(queryByText('Content 1')).toBeNull();
    });

    it('calls onValueChange when item is toggled', () => {
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
      fireEvent.press(trigger);

      expect(onValueChange).toHaveBeenCalledWith('item-1', {
        value: 'item-1',
        reason: 'toggle',
      });
    });
  });

  describe('Controlled State', () => {
    it('renders controlled value', () => {
      const { getByText, queryByText } = render(
        <AccordionRoot value='item-1'>
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
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 2</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 2</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      expect(getByText('Content 1')).toBeDefined();
      expect(queryByText('Content 2')).toBeNull();
    });

    it('calls onValueChange for controlled accordion', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot value='item-1' onValueChange={onValueChange}>
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
      fireEvent.press(trigger);

      expect(onValueChange).toHaveBeenCalled();
    });
  });

  describe('Multiple Open Items', () => {
    it('supports multiple open items', () => {
      const onValueChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot multiple onValueChange={onValueChange}>
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
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 2</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 2</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      const trigger1 = getByText('Item 1');
      fireEvent.press(trigger1);

      const trigger2 = getByText('Item 2');
      fireEvent.press(trigger2);

      expect(onValueChange).toHaveBeenCalledTimes(2);
      expect(onValueChange).toHaveBeenLastCalledWith(
        expect.arrayContaining(['item-1', 'item-2']),
        {
          value: expect.arrayContaining(['item-1', 'item-2']),
          reason: 'toggle',
        },
      );
    });

    it('closes item when already open in multiple mode', () => {
      const onValueChange = jest.fn();
      const { getByText, queryByText } = render(
        <AccordionRoot
          multiple
          defaultValue={['item-1', 'item-2']}
          onValueChange={onValueChange}
        >
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
          <AccordionItem value='item-2'>
            <AccordionHeader>
              <AccordionTrigger>
                <Text>Item 2</Text>
              </AccordionTrigger>
            </AccordionHeader>
            <AccordionPanel>
              <Text>Content 2</Text>
            </AccordionPanel>
          </AccordionItem>
        </AccordionRoot>,
      );

      expect(getByText('Content 1')).toBeDefined();
      expect(getByText('Content 2')).toBeDefined();

      const trigger1 = getByText('Item 1');
      fireEvent.press(trigger1);

      expect(queryByText('Content 1')).toBeNull();
    });
  });

  describe('Item onOpenChange', () => {
    it('calls onOpenChange on item', () => {
      const onOpenChange = jest.fn();
      const { getByText } = render(
        <AccordionRoot>
          <AccordionItem value='item-1' onOpenChange={onOpenChange}>
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
      fireEvent.press(trigger);

      expect(onOpenChange).toHaveBeenCalledWith(true, {
        open: true,
        value: 'item-1',
        reason: 'toggle',
      });
    });
  });
});
