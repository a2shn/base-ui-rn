import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import {
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionRoot,
  AccordionTrigger,
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
        <AccordionItem ref={ref} value='item-1'>
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
