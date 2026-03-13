import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Accordion } from '@base-ui-rn/accordion';
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
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>What is Base UI?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
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
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>How do I get started?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>Head to the "Quick start" guide in the docs.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger
                  testID='accordion-trigger-3'
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Can I use it for my project?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>Of course! Base UI is free and open source.</Text>
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
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Pre-opened item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>This panel is open by default.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Another item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
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
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>First item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>You can have multiple items open at once.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Second item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
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
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Enabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>This item is enabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2' disabled>
              <Accordion.Header>
                <Accordion.Trigger
                  style={({ open, disabled }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                    disabled ? styles.disabled : {},
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Disabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
                <Text>This item is disabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={({ open }) => [
                    styles.trigger,
                    { backgroundColor: open ? '#f5f5f5' : '#fff' },
                  ]}
                >
                  {({ open }) => (
                    <>
                      <Text>Another enabled</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel
                style={({ open }) => [
                  styles.panel,
                  open ? {} : styles.panelHidden,
                ]}
              >
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
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  icon: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  panel: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  panelHidden: {
    height: 0,
    overflow: 'hidden',
    paddingVertical: 0,
  },
  disabled: {
    opacity: 0.5,
  },
});
