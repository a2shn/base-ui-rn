import * as React from 'react';
import { View, Text } from 'react-native';
import styles from './playbookStyles';
import { FocusRing } from '@base-ui-rn/focus-ring';
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
                style={[
                  styles.buttonBase,
                  focusVisible && { borderColor: '#0071E3', borderWidth: 2 },
                ]}
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
                style={[
                  styles.buttonBase,
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
