import * as React from 'react';
import { View, Text, Platform } from 'react-native';
import { Gallery, Section } from '@base-ui-rn/playbook';
import { Button } from '@base-ui-rn/button';
import { Toggle } from '@base-ui-rn/toggle';
import { Shortcut } from '@base-ui-rn/keyboard-shortcuts';
import playbookStyles from './playbookStyles';

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
        <View style={playbookStyles.container}>
          <Text style={playbookStyles.hint}>
            Global hardware keyboard shortcuts (using window listeners) and
            shortcuts requiring modifier keys (like Ctrl/Meta) are generally
            only supported on the Web platform.
          </Text>
        </View>
      )}

      <Section title='Global Shortcuts (Web Only)'>
        <View style={playbookStyles.container}>
          <Text style={playbookStyles.meterLabel}>{globalMessage}</Text>
          <Text style={playbookStyles.hint}>
            Try: Ctrl+K, Ctrl+Shift+L, or Escape
          </Text>

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
        <View style={playbookStyles.container}>
          <Text style={playbookStyles.meterLabel}>{actionMessage}</Text>

          <Button
            onPress={() => handleAction('Saved! (Triggered via Ctrl+S)')}
            shortcut={{ keys: ['s'], modifiers: ['ctrl'], description: 'Save' }}
            style={playbookStyles.buttonBase}
          >
            {({ pressed }) => (
              <Text style={{ opacity: pressed ? 0.5 : 1 }}>Save (Ctrl+S)</Text>
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
            style={[playbookStyles.buttonBase, { backgroundColor: '#FF3B30' }]}
          >
            <Text style={{ color: '#fff' }}>Delete (Ctrl+BS)</Text>
          </Button>
        </View>
      </Section>

      <Section title='Toggle Shortcuts'>
        <View style={playbookStyles.container}>
          <Toggle
            shortcut={{ keys: ['b'], modifiers: ['ctrl'], description: 'Bold' }}
            style={playbookStyles.toggleBase}
          >
            {({ pressed }) => (
              <Text style={{ fontWeight: pressed ? 'bold' : 'normal' }}>
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
            style={playbookStyles.toggleBase}
          >
            {({ pressed }) => (
              <Text style={{ fontStyle: pressed ? 'italic' : 'normal' }}>
                Italic (Ctrl+I)
              </Text>
            )}
          </Toggle>
        </View>
      </Section>

      <Section title='Disabled Behavior'>
        <View style={playbookStyles.container}>
          <Button
            disabled
            onPress={() => handleAction('Error: This should not happen!')}
            shortcut={{
              keys: ['d'],
              modifiers: ['ctrl'],
              description: 'Disabled Action',
            }}
            style={[playbookStyles.buttonBase, { opacity: 0.5 }]}
          >
            <Text>Disabled (Ctrl+D)</Text>
          </Button>
          <Text style={playbookStyles.hint}>
            Pressing Ctrl+D should do nothing.
          </Text>
        </View>
      </Section>
    </Gallery>
  );
};
