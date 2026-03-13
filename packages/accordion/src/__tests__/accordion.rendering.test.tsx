import * as React from 'react';
import { Text, View } from 'react-native';
import { render } from '@testing-library/react-native';
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
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
});
