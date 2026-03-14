import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Accordion, type AccordionTriggerState } from '@base-ui-rn/accordion';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  theme,
} from '@base-ui-rn/playbook';

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
                  testID='accordion-trigger-2'
                  style={getTriggerStyle}
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
                  testID='accordion-trigger-3'
                  style={getTriggerStyle}
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
          <Accordion.Root value='item-1' onValueChange={() => {}}>
            <Accordion.Item value='item-1'>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
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
                <Accordion.Trigger style={getTriggerStyle}>
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
                <Accordion.Trigger style={getTriggerStyle}>
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
                <Accordion.Trigger style={getTriggerStyle}>
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
                <Accordion.Trigger style={getTriggerStyle}>
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

            <Accordion.Item value='item-2' disabled>
              <Accordion.Header>
                <Accordion.Trigger style={getTriggerStyle}>
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
                <Accordion.Trigger style={getTriggerStyle}>
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
  container: {
    width: 320,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignSelf: 'center',
    backgroundColor: theme.colors.bgCanvas,
  },
  trigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  triggerOpen: {
    backgroundColor: theme.colors.borderLight,
  },
  triggerDefault: {
    backgroundColor: 'transparent',
  },
  textPrimary: {
    color: theme.colors.textPrimary,
  },
  textSecondary: {
    color: theme.colors.textSecondary,
  },
  icon: {
    fontSize: 18,
    fontWeight: theme.font.weight.bold,
    color: theme.colors.textMuted,
  },
  panel: {
    paddingHorizontal: theme.spacing.lg,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.bgCanvas,
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
