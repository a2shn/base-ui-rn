import * as React from 'react';
import { View, Text, Platform, StyleSheet } from 'react-native';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import { Button } from '@base-ui-rn/button';
import { Toggle } from '@base-ui-rn/toggle';
import { Shortcut } from '@base-ui-rn/keyboard-shortcuts';

const isWeb = Platform.OS === 'web';

export const KeyboardShortcutsPlaybook = () => {
  const [globalMessage, setGlobalMessage] = React.useState('Press a shortcut!');
  const [actionMessage, setActionMessage] = React.useState(
    'Waiting for action...',
  );

  const handleGlobalShortcut = (key: string) => {
    setGlobalMessage(`Global shortcut matched: ${key}`);
    setTimeout(() => setGlobalMessage('Press a shortcut!'), 3000);
  };

  const handleAction = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage('Waiting for action...'), 3000);
  };

  return (
    <Gallery title='Keyboard Shortcuts'>
      {!isWeb && (
        <View style={styles.container}>
          <Text style={styles.hint}>
            Global hardware keyboard shortcuts (using window listeners) and
            shortcuts requiring modifier keys (like Ctrl/Meta) are generally
            only supported on the Web platform.
          </Text>
        </View>
      )}

      <Section title='Global Shortcuts (Web Only)'>
        <View style={styles.container}>
          <Text style={styles.label}>{globalMessage}</Text>
          <Text style={styles.hint}>Try: Ctrl+K, Ctrl+Shift+L, or Escape</Text>

          <Shortcut
            keys={['k']}
            modifiers={['ctrl']}
            onMatch={() => handleGlobalShortcut('Ctrl+K')}
            description='Global Search'
          />
          <Shortcut
            keys={['l']}
            modifiers={['ctrl', 'shift']}
            onMatch={() => handleGlobalShortcut('Ctrl+Shift+L')}
            description='Toggle Logging'
          />
          <Shortcut
            keys={['Escape']}
            onMatch={() => handleGlobalShortcut('Escape')}
            description='Close everything'
          />
        </View>
      </Section>

      <Section title='Button Shortcuts'>
        <View style={styles.container}>
          <Text style={styles.label}>{actionMessage}</Text>

          <Button
            onPress={() => handleAction('Saved! (Triggered via Ctrl+S)')}
            shortcut={{ keys: ['s'], modifiers: ['ctrl'], description: 'Save' }}
            style={styles.buttonBase}
          >
            {({ pressed }) => (
              <Text style={[styles.textPrimary, pressed && styles.pressedOpacity]}>
                Save (Ctrl+S)
              </Text>
            )}
          </Button>

          <Button
            onPress={() =>
              handleAction('Deleted! (Triggered via Ctrl+Backspace)')
            }
            shortcut={{
              keys: ['Backspace'],
              modifiers: ['ctrl'],
              description: 'Delete',
            }}
            style={[styles.buttonBase, styles.deleteButton]}
          >
            <Text style={styles.textPrimary}>Delete (Ctrl+BS)</Text>
          </Button>
        </View>
      </Section>

      <Section title='Toggle Shortcuts'>
        <View style={styles.container}>
          <Toggle
            shortcut={{ keys: ['b'], modifiers: ['ctrl'], description: 'Bold' }}
            style={styles.buttonBase}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.textPrimary,
                  { fontWeight: pressed ? theme.font.weight.bold : theme.font.weight.regular },
                ]}
              >
                Bold (Ctrl+B)
              </Text>
            )}
          </Toggle>

          <Toggle
            shortcut={{
              keys: ['i'],
              modifiers: ['ctrl'],
              description: 'Italic',
            }}
            style={styles.buttonBase}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.textPrimary,
                  { fontStyle: pressed ? 'italic' : 'normal' },
                ]}
              >
                Italic (Ctrl+I)
              </Text>
            )}
          </Toggle>
        </View>
      </Section>

      <Section title='Disabled Behavior'>
        <View style={styles.container}>
          <Button
            disabled
            onPress={() => handleAction('Error: This should not happen!')}
            shortcut={{
              keys: ['d'],
              modifiers: ['ctrl'],
              description: 'Disabled Action',
            }}
            style={[styles.buttonBase, styles.disabled]}
          >
            <Text style={styles.textPrimary}>Disabled (Ctrl+D)</Text>
          </Button>
          <Text style={styles.hint}>Pressing Ctrl+D should do nothing.</Text>
        </View>
      </Section>
    </Gallery>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.sm,
    gap: theme.spacing.md,
    alignItems: 'center',
    alignSelf: 'center',
  },
  label: {
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  hint: {
    fontSize: theme.font.size.xs,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
  buttonBase: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButton: {
    backgroundColor: theme.colors.borderLight,
  },
  disabled: {
    opacity: 0.5,
  },
  textPrimary: {
    color: theme.colors.textPrimary,
  },
  pressedOpacity: {
    opacity: 0.5,
  },
});
