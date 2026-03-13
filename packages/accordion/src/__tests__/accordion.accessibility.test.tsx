import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from '../index';

describe('Accordion - Accessibility', () => {
  it('has correct accessibility attributes on trigger when closed', () => {
    const { getByRole } = render(
      <AccordionRoot defaultValue=''>
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

    const button = getByRole('button');
    expect(button.props.accessibilityState).toMatchObject({
      expanded: false,
      disabled: false,
    });
  });

  it('has correct accessibility attributes on trigger when open', () => {
    const { getByRole } = render(
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

    const button = getByRole('button');
    expect(button.props.accessibilityState).toMatchObject({
      expanded: true,
      disabled: false,
    });
  });

  it('has correct accessibility attributes when disabled', () => {
    const { getByRole } = render(
      <AccordionRoot>
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

    const button = getByRole('button');
    expect(button.props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(button.props['data-disabled']).toBe('true');
  });

  it('has data attributes on items', () => {
    const { getByTestId } = render(
      <AccordionRoot>
        <AccordionItem value='item-1' testID='item'>
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

    const item = getByTestId('item');
    expect(item.props['data-index']).toBe(0);
    expect(item.props['data-open']).toBeUndefined();
  });

  it('has data attributes on items when open', () => {
    const { getByTestId } = render(
      <AccordionRoot defaultValue='item-1'>
        <AccordionItem value='item-1' testID='item'>
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

    const item = getByTestId('item');
    expect(item.props['data-open']).toBe('true');
  });

  it('has data-panel-open on trigger when open', () => {
    const { getByRole } = render(
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

    const button = getByRole('button');
    expect(button.props['data-panel-open']).toBe('true');
  });

  it('has data-orientation on root', () => {
    const { getByTestId } = render(
      <AccordionRoot orientation='vertical' testID='accordion-root'>
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
    expect(root.props['data-orientation']).toBe('vertical');
  });

  it('has data-disabled on root when disabled', () => {
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

  it('has aria-expanded on trigger through accessibilityState', () => {
    const { getByRole } = render(
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

    const button = getByRole('button');
    expect(button.props.accessibilityState.expanded).toBe(true);
  });
});
