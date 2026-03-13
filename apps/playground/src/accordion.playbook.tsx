import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {
  Accordion,
  type AccordionTriggerState,
  type AccordionPanelState,
} from '@base-ui-rn/accordion';
import { Gallery, Section, usePlaybookToggles } from '@base-ui-rn/playbook';

export function AccordionPlaybook() {
  usePlaybookToggles({
    darkMode: false,
    loading: false,
  });

  return (
    <Gallery title='Accordion'>
      <Section title='Default' showAllProps={true}>
        <View style={styles.container}>
          <Accordion.Root>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger
                  testID='accordion-trigger-1'
                  style={getTriggerStyle}
                >
                  {({ open }) => (
                    <>
                      <Text>What is Base UI?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>
                  Base UI is a library of high-quality unstyled React components
                  for design systems and web apps.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger
                  testID='accordion-trigger-2'
                  style={getTriggerStyle}
                >
                  {({ open }) => (
                    <>
                      <Text>How do I get started?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>Head to the "Quick start" guide in the docs.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger
                  testID='accordion-trigger-3'
                  style={getTriggerStyle}
                >
                  {({ open }) => (
                    <>
                      <Text>Can I use it for my project?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>Of course! Base UI is free and open source.</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>

      <Section title='Animated (Custom Variables)'>
        <View style={styles.container}>
          <Accordion.Root>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Animated Panel</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                keepMounted
                style={getAnimatedPanelStyle}
              >
                <View>
                  <Text>
                    This panel uses the --accordion-panel-height variable to
                    smoothly toggle its height.
                  </Text>
                  <Text style={{ marginTop: 8 }}>
                    It stays mounted to allow for height measurements even when
                    closed.
                  </Text>
                </View>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>

      <Section title='Controlled'>
        <View style={styles.container}>
          <Accordion.Root value='item-1' onValueChange={() => {}}>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Pre-opened item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>This panel is open by default.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Another item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>Click to toggle this panel.</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>

      <Section title='Multiple'>
        <View style={styles.container}>
          <Accordion.Root multiple>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>First item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>You can have multiple items open at once.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Second item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>Try opening both items!</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>

      <Section title='Disabled'>
        <View style={styles.container}>
          <Accordion.Root>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Enabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>This item is enabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2' disabled>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Disabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>This item is disabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
                  {({ open }) => (
                    <>
                      <Text>Another enabled</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text>This item is also enabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 320,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  triggerOpen: {
    backgroundColor: '#f5f5f5',
  },
  triggerDefault: {
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  panel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  animatedPanel: {
    overflow: 'hidden',
  },
  disabled: {
    opacity: 0.5,
  },
});

function getTriggerStyle({ open, disabled }: AccordionTriggerState) {
  return [
    styles.trigger,
    open ? styles.triggerOpen : styles.triggerDefault,
    disabled && styles.disabled,
  ];
}

function getAnimatedPanelStyle(state: AccordionPanelState) {
  return [
    styles.panel,
    styles.animatedPanel,
    {
      height: state.open ? state['--accordion-panel-height'] : 0,
      opacity: state.open ? 1 : 0,
    },
  ];
}
