import { fireEvent, render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform, Text, View } from 'react-native';

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
} from '../index';

describe('Accordion - Rendering', () => {
  it('renders correctly with children', () => {
    const { getByText } = render(
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
    expect(getByText('Item 1')).toBeDefined();
  });

  it('forwards ref to the root element', () => {
    const ref = React.createRef<View>();
    render(
      <AccordionRoot ref={ref}>
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
    expect(ref.current).toBeDefined();
  });

  it('renders multiple items', () => {
    const { getByText } = render(
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
    expect(getByText('Item 1')).toBeDefined();
    expect(getByText('Item 2')).toBeDefined();
  });

  it('provides state to children function', () => {
    const { getByText } = render(
      <AccordionRoot>
        <AccordionItem value='item-1'>
          {({ open }) => (
            <>
              <AccordionHeader>
                <AccordionTrigger>
                  <Text>{open ? 'Open' : 'Closed'}</Text>
                </AccordionTrigger>
              </AccordionHeader>
              <AccordionPanel>
                <Text>Content</Text>
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </AccordionRoot>,
    );
    expect(getByText('Closed')).toBeDefined();
  });

  it('supports style as a function of state', () => {
    const { getByText } = render(
      <AccordionRoot>
        <AccordionItem value='item-1'>
          <AccordionHeader>
            <AccordionTrigger
              style={({ open }) => ({
                backgroundColor: open ? 'blue' : 'red',
              })}
            >
              <Text>Item 1</Text>
            </AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>
            <Text>Content</Text>
          </AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    );
    expect(getByText('Item 1')).toBeDefined();
  });

  it('renders with defaultValue as string', () => {
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

  it('renders with defaultValue as array for multiple', () => {
    const { getByText } = render(
      <AccordionRoot defaultValue={['item-1', 'item-2']} multiple>
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
  });

  it('applies zIndex: 1 to Header and Trigger when open', () => {
    const { getByTestId } = render(
      <AccordionRoot defaultValue='item-1'>
        <AccordionItem testID='item' value='item-1'>
          <AccordionHeader testID='header'>
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

    const item = getByTestId('item');
    const header = getByTestId('header');
    const trigger = getByTestId('trigger');

    expect(item.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
    );

    if (Platform.OS === 'web') {
      expect(header.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(trigger.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
    } else {
      expect(header.props.style).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(trigger.props.style).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
    }
  });

  it('does not apply zIndex: 1 when closed', () => {
    const { getByTestId } = render(
      <AccordionRoot>
        <AccordionItem testID='item' value='item-1'>
          <AccordionHeader testID='header'>
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

    const item = getByTestId('item');
    const header = getByTestId('header');
    const trigger = getByTestId('trigger');

    expect(item.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
    );
    expect(header.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
    );
    expect(trigger.props.style).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
    );
  });

  it('elevates Item, Header and Trigger when focused', () => {
    const { getByTestId } = render(
      <AccordionRoot>
        <AccordionItem testID='item' value='item-1'>
          <AccordionHeader testID='header'>
            <AccordionTrigger testID='trigger'>
              <Text>Item 1</Text>
            </AccordionTrigger>
          </AccordionHeader>
        </AccordionItem>
      </AccordionRoot>,
    );

    const item = getByTestId('item');
    const header = getByTestId('header');
    const trigger = getByTestId('trigger');

    fireEvent(trigger, 'focus');

    if (Platform.OS === 'web') {
      expect(item.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(header.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(trigger.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
    } else {
      expect(item.props.style).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(header.props.style).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
      expect(trigger.props.style).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ zIndex: 1 })]),
      );
    }
  });
});
