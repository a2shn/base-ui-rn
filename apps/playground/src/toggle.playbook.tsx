import * as React from 'react';
import { Text } from 'react-native';
import { Toggle } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';

export function TogglePlaybook() {
  const { darkMode } = usePlaybookToggles({
    darkMode: false,
  });

  return (
    <Gallery title='Toggle'>
      <Section title='Uncontrolled State' showAllProps={true}>
        <Toggle.Root
          defaultChecked={false}
          accessibilityHint='Toggles notifications'
          testID='toggle-uncontrolled'
        >
          <Text>Notifications</Text>
        </Toggle.Root>
      </Section>

      <Section title='Controlled State'>
        <Toggle.Root
          role='switch'
          checked={darkMode.value}
          onCheckedChange={darkMode.setValue}
          accessibilityHint='Toggles dark mode'
          testID='toggle-dark-mode'
        >
          <Text>{darkMode.value ? 'ON' : 'OFF'}</Text>
        </Toggle.Root>

        <LiveConsole title='darkMode' state={darkMode} />
      </Section>

      <Section title='Disabled State'>
        <Toggle.Root
          disabled
          accessibilityHint='Locked setting'
          testID='toggle-disabled'
        >
          <Text>Disabled</Text>
        </Toggle.Root>
      </Section>
    </Gallery>
  );
}
