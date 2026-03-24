import { Accordion } from '@base-ui-rn/accordion';
import {
  Gallery,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function AccordionPlaybook() {
  usePlaybookToggles({
    darkMode: false,
    loading: false,
  });

  return (
    <Gallery title='Accordion'>
      <Section showAllProps={true} title='Default'>
        <View style={styles.container}>
          <Accordion.Root>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={styles.trigger}
                  testID='accordion-trigger-1'
                >
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>What is Base UI?</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  Base UI is a library of high-quality unstyled React components
                  for design systems and web apps.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={styles.trigger}
                  testID='accordion-trigger-2'
                >
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>
                        How do I get started?
                      </Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  Head to the "Quick start" guide in the docs.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger
                  style={styles.trigger}
                  testID='accordion-trigger-3'
                >
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>
                        Can I use it for my project?
                      </Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  Of course! Base UI is free and open source.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>

      <Section title='Controlled'>
        <View style={styles.container}>
          <Accordion.Root onValueChange={() => {}} value='item-1'>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Pre-opened item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  This panel is open by default.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Another item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  Click to toggle this panel.
                </Text>
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
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>First item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  You can have multiple items open at once.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Second item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  Try opening both items!
                </Text>
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
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Enabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>This item is enabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item disabled value='item-2'>
              <Accordion.Header>
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Disabled item</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>This item is disabled.</Text>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value='item-3'>
              <Accordion.Header>
                <Accordion.Trigger style={styles.trigger}>
                  {({ open }) => (
                    <>
                      <Text style={styles.textPrimary}>Another enabled</Text>
                      <Text style={styles.icon}>{open ? '×' : '+'}</Text>
                    </>
                  )}
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel style={styles.panel}>
                <Text style={styles.textSecondary}>
                  This item is also enabled.
                </Text>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  animatedPanel: {
    overflow: 'hidden',
  },
  container: {
    alignSelf: 'center',
    backgroundColor: theme.colors.bgCanvas,
    borderColor: theme.colors.border,
    borderWidth: 1,
    width: 320,
  },
  disabled: {
    opacity: 0.5,
  },
  icon: {
    color: theme.colors.textMuted,
    fontSize: 18,
    fontWeight: theme.font.weight.bold,
  },
  panel: {
    backgroundColor: theme.colors.bgCanvas,
    padding: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  textPrimary: {
    color: theme.colors.textPrimary,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  trigger: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  triggerDefault: {
    backgroundColor: 'transparent',
  },
});
