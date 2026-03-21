import { Button } from '@base-ui-rn/button';
import { FocusRing, type FocusRingRenderProps } from '@base-ui-rn/focus-ring';
import { Gallery, Section } from '@base-ui-rn/playbook';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  buttonBase: {
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#000000',
    fontSize: 14,
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 12,
    padding: 16,
  },
  defaultFocus: {
    outlineColor: '#0071E3',
    outlineWidth: 2,
  },
  focused: {
    backgroundColor: '#d0d0d0',
  },
  hint: {
    color: '#666666',
    fontSize: 12,
    textAlign: 'center',
  },
  outline: {
    borderColor: '#333333',
    borderWidth: 2,
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
