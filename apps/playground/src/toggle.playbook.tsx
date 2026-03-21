import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Toggle, type ToggleState } from '@base-ui-rn/toggle';
import * as React from 'react';
import { StyleSheet, Text } from 'react-native';

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
      <Section showAllProps={true} title='Uncontrolled'>
        <Toggle
          accessibilityHint='Toggles notifications'
          defaultPressed={false}
          style={getToggleStyle}
          testID='toggle-uncontrolled'
        >
          <Text style={styles.text}>Notifications</Text>
        </Toggle>
      </Section>

      <Section title='Controlled'>
        <Toggle
          accessibilityHint='Toggles dark mode'
          onPressedChange={darkMode.setValue}
          pressed={darkMode.value as boolean}
          role='switch'
          style={getToggleStyle}
          testID='toggle-dark-mode'
        >
          <Text style={styles.text}>{darkMode.value ? 'ON' : 'OFF'}</Text>
        </Toggle>
        <LiveConsole state={darkMode} title='darkMode' />
      </Section>

      <Section title='Disabled'>
        <Toggle
          accessibilityHint='Locked setting'
          disabled
          style={[styles.toggleBase, styles.disabled]}
          testID='toggle-disabled'
        >
          <Text style={styles.text}>Disabled</Text>
        </Toggle>
      </Section>

      <Section title='Processing'>
        <Toggle
          accessibilityHint={
            loading.value ? 'Applying changes, please wait' : 'Press to agree'
          }
          accessibilityLabel='Agree Toggle'
          accessibilityState={{ busy: loading.value as boolean }}
          disabled={loading.value as boolean}
          focusableWhenDisabled
          onPress={handleLoadingPress}
          style={getToggleStyle}
          testID='toggle-disabled-focusable'
        >
          <Text style={styles.text}>
            {loading.value ? 'Applying...' : 'Agree'}
          </Text>
        </Toggle>

        <LiveConsole state={loading} testID='loading-console' title='loading' />
        <LiveConsole
          state={loadingPressCount}
          testID='presses-console'
          title='presses'
        />
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    backgroundColor: '#3D3D3D',
    opacity: 0.7,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
  },
  toggleBase: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
});

function getToggleStyle({ pressed }: ToggleState) {
  return [styles.toggleBase, pressed && styles.pressed];
}
