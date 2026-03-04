import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FocusRing } from '@base-ui-rn/focus-ring';
import { Button } from '@base-ui-rn/button';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function FocusRingPlaybook() {
  return (
    <Gallery title='Focus Ring'>
      <Section title='Blue Outline (Web style)'>
        <View style={styles.container}>
          <FocusRing>
            {({ focusVisible }) => (
              <Button
                style={[styles.button, focusVisible && styles.focusedButton]}
              >
                <Text style={styles.text}>Focus Me</Text>
              </Button>
            )}
          </FocusRing>
          <Text style={styles.desc}>
            Focus this button via keyboard to see the blue outline.
          </Text>
        </View>
      </Section>

      <Section title='Custom Styling'>
        <View style={styles.container}>
          <FocusRing>
            {({ focused }) => (
              <Button
                style={[
                  styles.button,
                  { backgroundColor: focused ? '#0071E3' : '#f0f0f0' },
                ]}
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
    padding: 20,
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  focusedButton: {
    borderColor: '#0071E3',
    // Simulate an outline using shadow/elevation if possible,
    // but a thick border is most reliable for this prototype.
    borderWidth: 2,
  },
  text: {
    fontSize: 16,
  },
  desc: {
    fontSize: 12,
    color: '#666',
  },
});
