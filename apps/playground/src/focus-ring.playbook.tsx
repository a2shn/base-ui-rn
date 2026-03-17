import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusRing, type FocusRingRenderProps } from '@base-ui-rn/focus-ring';
import { Button } from '@base-ui-rn/button';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function FocusRingPlaybook() {
  return (
    <Gallery title='FocusRing'>
      <Section title='Themed Outline'>
        <View style={styles.container}>
          <FocusRing>
            {({ focusVisible }) => (
              <Button style={getOutlineButtonStyle({ focusVisible })}>
                <Text style={styles.buttonText}>Focus Me</Text>
              </Button>
            )}
          </FocusRing>
          <Text style={styles.hint}>
            Custom themed outline only (no default).
          </Text>
        </View>
      </Section>

      <Section title='Default Style'>
        <View style={styles.container}>
          <FocusRing>
            {({ focusVisible }) => (
              <Button style={getDefaultButtonStyle({ focusVisible })}>
                <Text style={styles.buttonText}>Focus Me</Text>
              </Button>
            )}
          </FocusRing>
          <Text style={styles.hint}>Default browser focus ring style.</Text>
        </View>
      </Section>

      <Section title='Custom Style'>
        <View style={styles.container}>
          <FocusRing>
            {({ focused }) => (
              <Button style={getCustomButtonStyle({ focused })}>
                <Text style={styles.buttonText}>
                  {focused ? 'Focused' : 'Idle'}
                </Text>
              </Button>
            )}
          </FocusRing>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  outline: {
    borderColor: '#333333',
    borderWidth: 2,
  },
  defaultFocus: {
    outlineWidth: 2,
    outlineColor: '#0071E3',
  },
  focused: {
    backgroundColor: '#d0d0d0',
  },
  hint: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  buttonText: {
    fontSize: 14,
    color: '#000000',
  },
});

function getOutlineButtonStyle({
  focusVisible,
}: Partial<FocusRingRenderProps>) {
  return [styles.buttonBase, focusVisible && styles.outline];
}

function getDefaultButtonStyle({
  focusVisible,
}: Partial<FocusRingRenderProps>) {
  return [styles.buttonBase, focusVisible && styles.defaultFocus];
}

function getCustomButtonStyle({ focused }: Partial<FocusRingRenderProps>) {
  return [styles.buttonBase, focused && styles.focused];
}
