import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusRing, type FocusState } from '@base-ui-rn/focus-ring';
import { Button } from '@base-ui-rn/button';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function FocusRingPlaybook() {
  return (
    <Gallery title='FocusRing'>
      <Section title='Blue Outline'>
        <View style={styles.container}>
          <FocusRing>
            {({ focusVisible }) => (
              <Button
                style={getOutlineButtonStyle({ focusVisible })}
              >
                <Text>Focus Me</Text>
              </Button>
            )}
          </FocusRing>
          <Text style={styles.hint}>
            Focus this button via keyboard to see the blue outline.
          </Text>
        </View>
      </Section>

      <Section title='Custom Style'>
        <View style={styles.container}>
          <FocusRing>
            {({ focused }) => (
              <Button
                style={getCustomButtonStyle({ focused })}
              >
                <Text style={{ color: focused ? '#fff' : '#000' }}>
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
    padding: 10,
    gap: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonBase: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderColor: '#0071E3',
    borderWidth: 2,
  },
  focused: {
    backgroundColor: '#0071E3',
  },
  hint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});

function getOutlineButtonStyle({ focusVisible }: Partial<FocusState>) {
  return [styles.buttonBase, focusVisible && styles.outline];
}

function getCustomButtonStyle({ focused }: Partial<FocusState>) {
  return [styles.buttonBase, focused && styles.focused];
}
