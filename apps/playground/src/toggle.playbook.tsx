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
  const { darkMode, loading } = usePlaybookToggles({
    darkMode: false,
    loading: false,
  });
  const handleLoadingPress = React.useCallback(() => {
    loading.setValue(true);
    setTimeout(() => loading.setValue(false), 2000);
  }, [loading]);

  return (
    <Gallery title='Toggle'>
      <Section title='Uncontrolled State' showAllProps={true}>
        <Toggle
          defaultPressed={false}
          accessibilityHint='Toggles notifications'
          testID='toggle-uncontrolled'
        >
          <Text>Notifications</Text>
        </Toggle>
      </Section>

      <Section title='Controlled State'>
        <Toggle
          role='switch'
          pressed={darkMode.value}
          onPressedChange={darkMode.setValue}
          accessibilityHint='Toggles dark mode'
          testID='toggle-dark-mode'
        >
          <Text>{darkMode.value ? 'ON' : 'OFF'}</Text>
        </Toggle>

        <LiveConsole title='darkMode' state={darkMode} />
      </Section>

      <Section title='Disabled State'>
        <Toggle
          disabled
          accessibilityHint='Locked setting'
          testID='toggle-disabled'
        >
          <Text>Disabled</Text>
        </Toggle>
      </Section>

      <Section title='Agree / Processing State'>
        <Toggle
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          accessibilityHint={
            loading.value ? 'Applying changes, please wait' : 'Press to agree'
          }
          testID='toggle-disabled-focusable'
          accessibilityLabel='Agree Toggle'
        >
          <Text>{loading.value ? 'Applying...' : 'Agree'}</Text>
        </Toggle>

        <LiveConsole title='loading' state={loading} />
      </Section>
    </Gallery>
  );
}
