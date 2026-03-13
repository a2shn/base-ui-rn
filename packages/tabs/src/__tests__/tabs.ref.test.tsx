import * as React from 'react';
import { View } from 'react-native';
import { render } from '@testing-library/react-native';
import { Tabs } from '../index';

describe('Tabs - Ref', () => {
  it('forwards refs correctly', () => {
    const rootRef = React.createRef<View>();
    const listRef = React.createRef<View>();
    const tabRef = React.createRef<View>();
    const panelRef = React.createRef<View>();

    render(
      <Tabs.Root ref={rootRef} defaultValue="tab-1">
        <Tabs.List ref={listRef}>
          <Tabs.Tab value="tab-1" ref={tabRef}>Tab 1</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="tab-1" ref={panelRef}>Content 1</Tabs.Panel>
      </Tabs.Root>
    );

    expect(rootRef.current).toBeTruthy();
    expect(listRef.current).toBeTruthy();
    expect(tabRef.current).toBeTruthy();
    expect(panelRef.current).toBeTruthy();
  });
});
