import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import { Switch } from '@base-ui-rn/switch';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SwitchPlaybook() {
  const { checked } = usePlaybookToggles({
    checked: false,
  });

  return (
    <Gallery title='Switch'>
      <Section title='Standard Demo'>
        <View style={styles.row}>
          <Switch.Root
            checked={checked.value as boolean}
            onCheckedChange={() => console.log("j")}
            style={getSwitchStyle}
          >
            <Switch.Thumb style={getThumbStyle} />
          </Switch.Root>
          <Text style={styles.label}>Toggle Me</Text>
        </View>
        <LiveConsole state={checked} title='checked' />
      </Section>

      <Section title='Disabled'>
        <View style={styles.row}>
          <Switch.Root disabled style={getSwitchStyle}>
            <Switch.Thumb style={getThumbStyle} />
          </Switch.Root>
          <Text style={styles.label}>Disabled Off</Text>
        </View>
        <View style={styles.row}>
          <Switch.Root checked disabled style={getSwitchStyle}>
            <Switch.Thumb style={getThumbStyle} />
          </Switch.Root>
          <Text style={styles.label}>Disabled On</Text>
        </View>
      </Section>

      <Section title='Read Only'>
        <View style={styles.row}>
          <Switch.Root readOnly style={getSwitchStyle}>
            <Switch.Thumb style={getThumbStyle} />
          </Switch.Root>
          <Text style={styles.label}>Read Only Off</Text>
        </View>
        <View style={styles.row}>
          <Switch.Root checked readOnly style={getSwitchStyle}>
            <Switch.Thumb style={getThumbStyle} />
          </Switch.Root>
          <Text style={styles.label}>Read Only On</Text>
        </View>
      </Section>
    </Gallery>
  );
}

function getSwitchStyle(state: {
  checked: boolean;
  disabled: boolean;
  focused: boolean;
}) {
  return [
    styles.switchBase,
    state.checked ? styles.switchChecked : styles.switchUnchecked,

    state.disabled && styles.switchDisabled,
  ];
}

function getThumbStyle(state: { checked: boolean; disabled: boolean }) {
  return [
    styles.thumbBase,
    state.checked ? styles.thumbChecked : styles.thumbUnchecked,
    state.disabled && styles.thumbDisabled,
  ];
}

const styles = StyleSheet.create({
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
  row: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  switchBase: {
    borderRadius: 9999,
    height: 24,
    padding: 2,
    width: 44,
  },
  switchChecked: {
    backgroundColor: theme.colors.textPrimary,
  },
  switchDisabled: {
    opacity: 0.5,
  },
  switchUnchecked: {
    backgroundColor: theme.colors.border,
  },
  thumbBase: {
    aspectRatio: 1,
    backgroundColor: theme.colors.bgCanvas,
    borderRadius: 9999,
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  thumbChecked: {
    alignSelf: 'flex-end',
  },
  thumbDisabled: {
    backgroundColor: theme.colors.borderLight,
  },
  thumbUnchecked: {
    alignSelf: 'flex-start',
  },
});
