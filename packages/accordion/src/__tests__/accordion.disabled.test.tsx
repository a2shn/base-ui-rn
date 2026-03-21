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

describe('Accordion - Disabled State', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Item Disabled', () => {
    it('ignores presses when item is disabled', () => {
      const onValueChange = jest.fn();
      const { queryByText } = render(
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

      const trigger = queryByText('Item 1');
      if (trigger) {
        fireEvent.press(trigger);
      }

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('does not toggle on keyboard when disabled', () => {
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

    it('applies disabled accessibility state', () => {
      const { getByRole } = render(
        <AccordionRoot>
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

      const button = getByRole('button');
      expect(button.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Root Disabled', () => {
    it('ignores presses when root is disabled', () => {
      const onValueChange = jest.fn();
      const { queryByText } = render(
        <AccordionRoot disabled onValueChange={onValueChange}>
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

      const trigger = queryByText('Item 1');
      if (trigger) {
        fireEvent.press(trigger);
      }

      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('applies disabled data attribute to root', () => {
      const { getByTestId } = render(
        <AccordionRoot disabled testID='accordion-root'>
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

      const root = getByTestId('accordion-root');
      expect(root.props['data-disabled']).toBe('true');
    });
  });
});
