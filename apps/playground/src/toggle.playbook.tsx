import * as React from 'react';
import { Text, View } from 'react-native';
import { Toggle } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';
import styles from './playbookStyles';

export function TogglePlaybook() {
  const { darkMode, loading, loadingPressCount } = usePlaybookToggles({
    darkMode: false,
    loading: false,
    loadingPressCount: 0,
  });

  const handleLoadingPress = React.useCallback(() => {
    loadingPressCount.setValue((prev: number) => prev + 1);
    if (loading.value) return;
    loading.setValue(true);
    setTimeout(() => loading.setValue(false), 2000);
  }, [loading, loadingPressCount]);

  const toggleBaseStyle = styles.toggleBase;

  return (
    <Gallery title='Toggle'>
      <Section title='Uncontrolled' showAllProps={true}>
        <Toggle
          defaultPressed={false}
          accessibilityHint='Toggles notifications'
          testID='toggle-uncontrolled'
          style={({ pressed }) => [
            toggleBaseStyle,
            pressed && { opacity: 0.7, backgroundColor: '#e0e0e0' },
          ]}
        >
          <Text>Notifications</Text>
        </Toggle>
      </Section>

      <Section title='Controlled'>
        <Toggle
          role='switch'
          pressed={darkMode.value as boolean}
          onPressedChange={darkMode.setValue}
          accessibilityHint='Toggles dark mode'
          testID='toggle-dark-mode'
          style={({ pressed }) => [
            toggleBaseStyle,
            pressed && { opacity: 0.7, backgroundColor: '#e0e0e0' },
          ]}
        >
          <Text>{darkMode.value ? 'ON' : 'OFF'}</Text>
        </Toggle>
        <LiveConsole title='darkMode' state={darkMode} />
      </Section>

      <Section title='Disabled'>
        <Toggle
          disabled
          accessibilityHint='Locked setting'
          testID='toggle-disabled'
          style={[toggleBaseStyle, { opacity: 0.5 }]}
        >
          <Text>Disabled</Text>
        </Toggle>
      </Section>

      <Section title='Processing'>
        <Toggle
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          accessibilityHint={
            loading.value ? 'Applying changes, please wait' : 'Press to agree'
          }
          accessibilityState={{ busy: loading.value as boolean }}
          testID='toggle-disabled-focusable'
          accessibilityLabel='Agree Toggle'
          style={({ pressed }) => [
            toggleBaseStyle,
            pressed && { opacity: 0.7, backgroundColor: '#e0e0e0' },
          ]}
        >
          <Text>{loading.value ? 'Applying...' : 'Agree'}</Text>
        </Toggle>

        <LiveConsole title='loading' state={loading} testID='loading-console' />
        <LiveConsole
          title='presses'
          state={loadingPressCount}
          testID='presses-console'
        />
      </Section>
    </Gallery>
  );
}
