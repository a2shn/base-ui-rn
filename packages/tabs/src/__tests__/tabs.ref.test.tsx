import { render } from '@testing-library/react-native';
import * as React from 'react';
import { View } from 'react-native';

import { Tabs } from '../index';

describe('Tabs - Ref', () => {
  it('forwards refs correctly', () => {
    const rootRef = React.createRef<View>();
    const listRef = React.createRef<View>();
    const tabRef = React.createRef<View>();
    const panelRef = React.createRef<View>();

    render(
      <Tabs.Root defaultValue='tab-1' ref={rootRef}>
        <Tabs.List ref={listRef}>
          <Tabs.Tab ref={tabRef} value='tab-1'>
            Tab 1
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel ref={panelRef} value='tab-1'>
          Content 1
        </Tabs.Panel>
      </Tabs.Root>,
    );

    expect(rootRef.current).toBeTruthy();
    expect(listRef.current).toBeTruthy();
    expect(tabRef.current).toBeTruthy();
    expect(panelRef.current).toBeTruthy();
  });
});
