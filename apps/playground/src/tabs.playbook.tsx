import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tabs, type TabState, type TabsIndicatorState } from '@base-ui-rn/tabs';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

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
              <Text style={styles.panelText}>Overview content</Text>
            </Tabs.Panel>
            <Tabs.Panel value='tab-2' style={styles.panel}>
              <Text style={styles.panelText}>Projects content</Text>
            </Tabs.Panel>
            <Tabs.Panel value='tab-3' style={styles.panel}>
              <Text style={styles.panelText}>Account content</Text>
            </Tabs.Panel>
          </Tabs.Root>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.container}>
          <Tabs.Root orientation='vertical' defaultValue='tab-1'>
            <View style={styles.verticalWrapper}>
              <Tabs.List style={styles.verticalList}>
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
              <View style={styles.flex1}>
                <Tabs.Panel value='tab-1' style={styles.panel}>
                  <Text style={styles.panelText}>Vertical Panel 1</Text>
                </Tabs.Panel>
                <Tabs.Panel value='tab-2' style={styles.panel}>
                  <Text style={styles.panelText}>Vertical Panel 2</Text>
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
    padding: theme.spacing.xl,
    alignSelf: 'center',
  },
  list: {
    flexDirection: 'row',
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  verticalWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  verticalList: {
    flexDirection: 'column',
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    padding: theme.spacing.xs,
    gap: theme.spacing.xs,
  },
  tab: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radius.sm + 2,
  },
  tabText: {
    fontSize: theme.font.size.md,
    color: theme.colors.textSecondary,
  },
  activeTabText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.semibold,
  },
  panel: {
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    minHeight: 100,
    marginTop: theme.spacing.md,
  },
  panelText: {
    color: theme.colors.textPrimary,
  },
  flex1: {
    flex: 1,
  },
  indicator: {
    position: 'absolute',
    backgroundColor: theme.colors.border, // Or another suitable dark color
  },
});

function getTabStyle({ active }: TabState) {
  return [styles.tab, active && { backgroundColor: theme.colors.border }];
}

function getIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      bottom: 0,
      height: 0, // Hidden for this style
      width: state['--active-tab-width'],
      transform: [{ translateX: state['--active-tab-left'] ?? 0 }],
    },
  ];
}

function getVerticalIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      right: 0,
      width: 0, // Hidden for this style
      height: state['--active-tab-height'],
      transform: [{ translateY: state['--active-tab-top'] ?? 0 }],
    },
  ];
}
