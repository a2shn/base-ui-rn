import * as React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
  theme,
} from '@base-ui-rn/playbook';

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

  return (
    <Gallery title='Toggle'>
      <Section title='Uncontrolled' showAllProps={true}>
        <Toggle
          defaultPressed={false}
          accessibilityHint='Toggles notifications'
          testID='toggle-uncontrolled'
          style={getToggleStyle}
        >
          <Text style={styles.text}>Notifications</Text>
        </Toggle>
      </Section>

      <Section title='Controlled'>
        <Toggle
          role='switch'
          pressed={darkMode.value as boolean}
          onPressedChange={darkMode.setValue}
          accessibilityHint='Toggles dark mode'
          testID='toggle-dark-mode'
          style={getToggleStyle}
        >
          <Text style={styles.text}>{darkMode.value ? 'ON' : 'OFF'}</Text>
        </Toggle>
        <LiveConsole title='darkMode' state={darkMode} />
      </Section>

      <Section title='Disabled'>
        <Toggle
          disabled
          accessibilityHint='Locked setting'
          testID='toggle-disabled'
          style={[styles.toggleBase, styles.disabled]}
        >
          <Text style={styles.text}>Disabled</Text>
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
          style={getToggleStyle}
        >
          <Text style={styles.text}>
            {loading.value ? 'Applying...' : 'Agree'}
          </Text>
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

const styles = StyleSheet.create({
  toggleBase: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: '#3D3D3D',
  },
  disabled: {
    opacity: 0.5,
  },
});

function getToggleStyle({ pressed }: ToggleState) {
  return [styles.toggleBase, pressed && styles.pressed];
}
