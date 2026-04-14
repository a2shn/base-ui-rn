import { Input, type InputState } from '@base-ui-rn/input';
import {
  Gallery,
  LiveConsole,
  Section,
  theme,
  usePlaybookToggles,
} from '@base-ui-rn/playbook';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export function InputPlaybook() {
  const { disabled, invalid, name } = usePlaybookToggles({
    disabled: false,
    invalid: false,
    name: '',
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Gallery title='Input'>
          <Section title='Basic'>
            <Input
              onValueChange={name.setValue}
              placeholder='Enter your name'
              style={styles.input}
              value={name.value as string}
            />
            <LiveConsole state={name} title='name' />
          </Section>

          <Section title='States'>
            <View style={styles.statesContainer}>
              <Input
                disabled={disabled.value as boolean}
                invalid={invalid.value as boolean}
                placeholder='Interactive states'
                style={getInputStyle}
              />

              <View style={styles.controls}>
                <Text
                  onPress={() => disabled.setValue(!disabled.value)}
                  style={[
                    styles.control,
                    disabled.value && styles.activeControl,
                  ]}
                >
                  Disabled: {String(disabled.value)}
                </Text>
                <Text
                  onPress={() => invalid.setValue(!invalid.value)}
                  style={[
                    styles.control,
                    invalid.value && styles.activeControl,
                  ]}
                >
                  Invalid: {String(invalid.value)}
                </Text>
              </View>
            </View>
          </Section>

          <Section title='Uncontrolled'>
            <Input
              defaultValue='Default Value'
              placeholder='Uncontrolled input'
              style={styles.input}
              submitBehavior='submit'
            />
          </Section>
        </Gallery>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function getInputStyle(state: InputState) {
  return [
    styles.input,
    state.invalid && styles.inputInvalid,
    state.disabled && styles.inputDisabled,
  ];
}

const styles = StyleSheet.create({
  activeControl: {
    backgroundColor: '#0071E3',
    borderColor: '#0071E3',
    color: '#FFF',
  },
  control: {
    borderColor: theme.colors.border,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  customFocusRing: {
    borderColor: 'magenta',
    borderWidth: 2,
  },
  flex: {
    flex: 1,
  },
  input: {
    backgroundColor: theme.colors.bgSecondary,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    height: 44,
    paddingHorizontal: theme.spacing.md,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  inputInvalid: {
    borderColor: 'red',
  },
  scrollContent: {
    flexGrow: 1,
  },
  statesContainer: {
    width: '100%',
  },
});
