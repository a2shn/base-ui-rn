import { Button } from '@base-ui-rn/button';
import { Shortcut } from '@base-ui-rn/keyboard-shortcuts';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import { Toggle } from '@base-ui-rn/toggle';
import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

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
            description='Global Search'
            keys={['k']}
            modifiers={['ctrl']}
            onMatch={() => handleGlobalShortcut('Ctrl+K')}
          />
          <Shortcut
            description='Toggle Logging'
            keys={['l']}
            modifiers={['ctrl', 'shift']}
            onMatch={() => handleGlobalShortcut('Ctrl+Shift+L')}
          />
          <Shortcut
            description='Close everything'
            keys={['Escape']}
            onMatch={() => handleGlobalShortcut('Escape')}
          />
        </View>
      </Section>

      <Section title='Button Shortcuts'>
        <View style={styles.container}>
          <Text style={styles.label}>{actionMessage}</Text>

          <Button
            onPress={() => handleAction('Saved! (Triggered via Ctrl+S)')}
            shortcut={{ description: 'Save', keys: ['s'], modifiers: ['ctrl'] }}
            style={styles.buttonBase}
          >
            {({ pressed }) => (
              <Text
                style={[styles.textPrimary, pressed && styles.pressedOpacity]}
              >
                Save (Ctrl+S)
              </Text>
            )}
          </Button>

          <Button
            onPress={() =>
              handleAction('Deleted! (Triggered via Ctrl+Backspace)')
            }
            shortcut={{
              description: 'Delete',
              keys: ['Backspace'],
              modifiers: ['ctrl'],
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
            shortcut={{ description: 'Bold', keys: ['b'], modifiers: ['ctrl'] }}
            style={styles.buttonBase}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.textPrimary,
                  {
                    fontWeight: pressed
                      ? theme.font.weight.bold
                      : theme.font.weight.regular,
                  },
                ]}
              >
                Bold (Ctrl+B)
              </Text>
            )}
          </Toggle>

          <Toggle
            shortcut={{
              description: 'Italic',
              keys: ['i'],
              modifiers: ['ctrl'],
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
              description: 'Disabled Action',
              keys: ['d'],
              modifiers: ['ctrl'],
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
  buttonBase: {
    alignItems: 'center',
    backgroundColor: theme.colors.border,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
  },
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  deleteButton: {
    backgroundColor: theme.colors.borderLight,
  },
  disabled: {
    opacity: 0.5,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.font.size.xs,
    textAlign: 'center',
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
    fontWeight: theme.font.weight.medium,
    textAlign: 'center',
  },
  pressedOpacity: {
    opacity: 0.5,
  },
  textPrimary: {
    color: theme.colors.textPrimary,
  },
});
