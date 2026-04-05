import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import { Tabs, type TabsIndicatorState } from '@base-ui-rn/tabs';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function TabsPlaybook() {
  return (
    <Gallery title='Tabs'>
      <Section title='Default'>
        <View style={styles.container}>
          <Tabs.Root defaultValue='tab-1'>
            <Tabs.List style={styles.list}>
              <Tabs.Tab style={styles.tab} value='tab-1' onKeyDown={() => { console.log("ll") }}>
                {({ active }) => (
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    Overview
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab style={styles.tab} value='tab-2' >
                {({ active }) => (
                  <Text
                    style={[styles.tabText, active && styles.activeTabText]}
                  >
                    Projects
                  </Text>
                )}
              </Tabs.Tab>
              <Tabs.Tab style={styles.tab} value='tab-3'>
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
            <Tabs.Panel style={styles.panel} value='tab-1'>
              <Text style={styles.panelText}>Overview content</Text>
            </Tabs.Panel>
            <Tabs.Panel style={styles.panel} value='tab-2'>
              <Text style={styles.panelText}>Projects content</Text>
            </Tabs.Panel>
            <Tabs.Panel style={styles.panel} value='tab-3'>
              <Text style={styles.panelText}>Account content</Text>
            </Tabs.Panel>
          </Tabs.Root>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.container}>
          <Tabs.Root defaultValue='tab-1' orientation='vertical'>
            <View style={styles.verticalWrapper}>
              <Tabs.List style={styles.verticalList}>
                <Tabs.Tab style={styles.tab} value='tab-1'>
                  {({ active }) => (
                    <Text
                      style={[styles.tabText, active && styles.activeTabText]}
                    >
                      Tab 1
                    </Text>
                  )}
                </Tabs.Tab>
                <Tabs.Tab style={styles.tab} value='tab-2'>
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
                <Tabs.Panel style={styles.panel} value='tab-1'>
                  <Text style={styles.panelText}>Vertical Panel 1</Text>
                </Tabs.Panel>
                <Tabs.Panel style={styles.panel} value='tab-2'>
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
  activeTabText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.font.weight.semibold,
  },
  container: {
    alignSelf: 'center',
    padding: theme.spacing.xl,
    width: '100%',
  },
  flex1: {
    flex: 1,
  },
  indicator: {
    backgroundColor: theme.colors.border, // Or another suitable dark color
    position: 'absolute',
  },
  list: {
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  panel: {
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.md,
    minHeight: 100,
    padding: theme.spacing.xl,
  },
  panelText: {
    color: theme.colors.textPrimary,
  },
  tab: {
    borderRadius: theme.radius.sm + 2,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  tabText: {
    color: theme.colors.textSecondary,
    fontSize: theme.font.size.md,
  },
  verticalList: {
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: theme.radius.md,
    flexDirection: 'column',
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  verticalWrapper: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
});

function getIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      bottom: 0,
      height: 0, // Hidden for this style
      transform: [{ translateX: state.tab.left ?? 0 }],
      width: state.tab.width,
    },
  ];
}

function getVerticalIndicatorStyle(state: TabsIndicatorState) {
  return [
    styles.indicator,
    {
      height: state.tab.height,
      right: 0,
      transform: [{ translateY: state.tab.top ?? 0 }],
      width: 0, // Hidden for this style
    },
  ];
}
