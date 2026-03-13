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

describe('Accordion - Ref Forwarding', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('forwards ref to root element', () => {
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

  it('forwards ref to item element', () => {
    const ref = React.createRef<View>();
    render(
      <AccordionRoot>
        <AccordionItem value='item-1' ref={ref}>
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

  it('allows accessing native properties through forwarded ref', () => {
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
    expect(ref.current?.props).toBeDefined();
  });
});
