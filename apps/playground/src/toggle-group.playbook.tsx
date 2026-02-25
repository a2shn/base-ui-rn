import * as React from 'react';
import { Text, View } from 'react-native';
import { ToggleGroup } from '@base-ui-rn/toggle-group';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function ToggleGroupPlaybook() {
  return (
    <Gallery title='Toggle Group'>
      <Section title='Basic Implementation'>
        <ToggleGroup
          testID='toggle-group-basic'
          style={{ padding: 20, backgroundColor: '#f0f0f0' }}
        >
          <Text>Toggle Group Placeholder</Text>
        </ToggleGroup>
      </Section>
    </Gallery>
  );
}
