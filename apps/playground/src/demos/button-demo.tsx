import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@base-ui-rn/button';

/**
 * Demo showcasing the Button.Root primitive.
 * Demonstrates standard usage, render props for state-based UI, and disabled states.
 */
export function ButtonDemo() {
  const [count, setCount] = React.useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.title} testID='counter'>
        Count: {count}
      </Text>

      {/* 1. Standard Button */}
      <View style={styles.section}>
        <Button.Root
          accessibilityHint='Increments the counter'
          onPress={() => setCount((c) => c + 1)}
        >
          <Text>Standard Button</Text>
        </Button.Root>
      </View>

      <View style={styles.separator} />

      {/* 2. Render Prop Pattern */}
      <View style={styles.section}>
        <Button.Root
          accessibilityHint='Increments the counter with dynamic visual feedback'
          onPress={() => setCount((c) => c + 1)}
        >
          {({ pressed }) => (
            <Text style={{ opacity: pressed ? 0.5 : 1 }}>
              {pressed ? '👇 Pressed!' : '👉 Interactive Button'}
            </Text>
          )}
        </Button.Root>
      </View>

      <View style={styles.separator} />

      {/* 3. Disabled State */}
      <View style={styles.section}>
        <Button.Root
          disabled
          accessibilityHint='This button is locked'
          onPress={() => setCount((c) => c + 1)}
        >
          <Text style={{ color: 'gray' }}>🔒 Disabled Button</Text>
        </Button.Root>
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
