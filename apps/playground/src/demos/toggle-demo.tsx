import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Toggle } from '@base-ui-rn/toggle';

/**
 * Minimal demo showcasing the Toggle.Root primitive.
 * Focuses on clean text states and native accessibility tree synchronization.
 */
export function ToggleDemo() {
  const [switchChecked, setSwitchChecked] = React.useState(false);
  const [customChecked, setCustomChecked] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Toggle Primitives</Text>

      {/* 1. Uncontrolled Checkbox */}
      <View style={styles.section}>
        <Toggle.Root
          defaultChecked={false}
          accessibilityHint='Toggles notifications'
          testID='uncontrolled-toggle'
        >
          <Text>🔔 Notifications</Text>
        </Toggle.Root>
      </View>

      <View style={styles.separator} />

      {/* 2. Controlled Switch */}
      <View style={styles.section}>
        <Toggle.Root
          role='switch'
          checked={switchChecked}
          onCheckedChange={setSwitchChecked}
          accessibilityHint='Toggles dark mode'
          testID='controlled-switch'
        >
          <Text>
            {switchChecked ? '🌙 Dark Mode: ON' : '☀️ Light Mode: OFF'}
          </Text>
        </Toggle.Root>
      </View>

      <View style={styles.separator} />

      {/* 3. Custom Styling via Render Props (Normal Text Version) */}
      <View style={styles.section}>
        <Toggle.Root
          checked={customChecked}
          onCheckedChange={setCustomChecked}
          accessibilityHint='Accept terms'
          testID='slotted-toggle'
        >
          {({ pressed }) => (
            <View style={{ opacity: pressed ? 0.5 : 1, flexDirection: 'row' }}>
              <Text
                style={{
                  color: customChecked ? '#28a745' : '#dc3545',
                  fontWeight: 'bold',
                  marginRight: 4,
                }}
              >
                {customChecked ? 'Agreed:' : 'Pending:'}
              </Text>
              <Text>Terms and Conditions</Text>
            </View>
          )}
        </Toggle.Root>
      </View>

      <View style={styles.separator} />

      {/* 4. Disabled State */}
      <View style={styles.section}>
        <Toggle.Root
          disabled
          accessibilityHint='This setting is locked'
          testID='disabled-toggle'
        >
          <Text style={{ color: 'gray' }}>🔒 Locked (Cannot click)</Text>
        </Toggle.Root>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    paddingVertical: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
});
