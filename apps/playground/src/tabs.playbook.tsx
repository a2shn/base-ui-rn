import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Tabs,
  type TabState,
  type TabsIndicatorState,
} from '@base-ui-rn/tabs';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function TabsPlaybook() {
  return (
    <Gallery title='Tabs'>
      <Section title='Default'>
        <View style={styles.container}>
          <Tabs.Root defaultValue='tab-1'>
            <Tabs.List style={styles.list}>
              <Tabs.Tab value='tab-1' style={getTabStyle}>
                {({ active }) => (
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    Overview
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab value='tab-2' style={getTabStyle}>
                {({ active }) => (
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    Projects
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab value='tab-3' style={getTabStyle}>
                {({ active }) => (
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    Account
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Indicator style={getIndicatorStyle} />
            </Tabs.List>
            <Tabs.Panel value='tab-1' style={styles.panel}>
              <Text>Overview content</Text>
            </Tabs.Panel>
            <Tabs.Panel value='tab-2' style={styles.panel}>
              <Text>Projects content</Text>
            </Tabs.Panel>
            <Tabs.Panel value='tab-3' style={styles.panel}>
              <Text>Account content</Text>
            </Tabs.Panel>
          </Tabs.Root>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.container}>
          <Tabs.Root orientation='vertical' defaultValue='tab-1'>
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Tabs.List style={[styles.list, { flexDirection: 'column' }]}>
                <Tabs.Tab value='tab-1' style={getTabStyle}>
                  {({ active }) => (
                    <Text
                      style={[styles.tabText, active && styles.activeTabText]}
                    >
                      Tab 1
                    </Text>
                  )}
                </Tabs.Tab>
                <Tabs.Tab value='tab-2' style={getTabStyle}>
                  {({ active }) => (
                    <Text
                      style={[styles.tabText, active && styles.activeTabText]}
                    >
                      Tab 2
                    </Text>
                  )}
                </Tabs.Tab>
                <Tabs.Indicator style={getVerticalIndicatorStyle} />
              </Tabs.List>
              <View style={{ flex: 1 }}>
                <Tabs.Panel value='tab-1' style={styles.panel}>
                  <Text>Vertical Panel 1</Text>
                </Tabs.Panel>
                <Tabs.Panel value='tab-2' style={styles.panel}>
                  <Text>Vertical Panel 2</Text>
                </Tabs.Panel>
              </View>
            </View>
          </Tabs.Root>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    alignSelf: 'center',
  },
  list: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0071E3',
    fontWeight: '600',
  },
  panel: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    minHeight: 100,
  },
  indicator: {
    position: 'absolute',
    backgroundColor: '#0071E3',
  },
});

function getTabStyle({ active }: TabState) {
  return [
    styles.tab,
    active && { borderBottomWidth: 2, borderBottomColor: 'transparent' },
  ];
}

function getIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      bottom: -1,
      height: 2,
      width: state['--active-tab-width'],
      transform: [{ translateX: state['--active-tab-left'] ?? 0 }],
    },
  ];
}

function getVerticalIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      right: -1,
      width: 2,
      height: state['--active-tab-height'],
      transform: [{ translateY: state['--active-tab-top'] ?? 0 }],
    },
  ];
}
