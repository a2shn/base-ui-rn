import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs, type TabState } from '@base-ui-rn/tabs';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function TabsPlaybook() {
  return (
    <Gallery title='Tabs'>
      <Section title='Default'>
        <View style={styles.container}>
          <Tabs.Root defaultValue="tab-1">
            <Tabs.List style={styles.list}>
              <Tabs.Tab value="tab-1" style={getTabStyle}>
                {({ active }) => (
                  <Text style={[styles.tabText, active && styles.activeTabText]}>
                    Overview
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab value="tab-2" style={getTabStyle}>
                {({ active }) => (
                  <Text style={[styles.tabText, active && styles.activeTabText]}>
                    Projects
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab value="tab-3" style={getTabStyle}>
                {({ active }) => (
                  <Text style={[styles.tabText, active && styles.activeTabText]}>
                    Account
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Indicator style={styles.indicator} />
            </Tabs.List>
            <Tabs.Panel value="tab-1" style={styles.panel}>
              <Text>Overview content</Text>
            </Tabs.Panel>
            <Tabs.Panel value="tab-2" style={styles.panel}>
              <Text>Projects content</Text>
            </Tabs.Panel>
            <Tabs.Panel value="tab-3" style={styles.panel}>
              <Text>Account content</Text>
            </Tabs.Panel>
          </Tabs.Root>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.container}>
          <Tabs.Root orientation="vertical" defaultValue="tab-1">
            <View style={{ flexDirection: 'row', gap: 20 }}>
              <Tabs.List style={[styles.list, { flexDirection: 'column' }]}>
                <Tabs.Tab value="tab-1" style={getTabStyle}>
                  {({ active }) => (
                    <Text style={[styles.tabText, active && styles.activeTabText]}>
                      Tab 1
                    </Text>
                  )}
                </Tabs.Tab>
                <Tabs.Tab value="tab-2" style={getTabStyle}>
                  {({ active }) => (
                    <Text style={[styles.tabText, active && styles.activeTabText]}>
                      Tab 2
                    </Text>
                  )}
                </Tabs.Tab>
                <Tabs.Indicator style={[styles.indicator, { width: 2, height: 'var(--active-tab-height)', transform: [{ translateY: 'var(--active-tab-top)' }] } as any]} />
              </Tabs.List>
              <View>
                <Tabs.Panel value="tab-1" style={styles.panel}>
                  <Text>Vertical Panel 1</Text>
                </Tabs.Panel>
                <Tabs.Panel value="tab-2" style={styles.panel}>
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
    bottom: -1,
    height: 2,
    backgroundColor: '#0071E3',
    // In a real app, these variables would be accessed via state
    // but here we demonstrate the intent.
  },
});

function getTabStyle({ active }: TabState) {
  return [
    styles.tab,
    active && { borderBottomWidth: 2, borderBottomColor: 'transparent' }
  ];
}
