import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Button } from '@base-ui-rn/button';

export function ButtonDemo() {
  const [count, setCount] = React.useState(0);

  return (
    <View>
      <Text testID='counter'>Count: {count}</Text>

      <Button.Root
        accessibilityHint='Increments the counter'
        onPress={() => setCount((c) => c + 1)}
      >
        <Text>Standard Button</Text>
      </Button.Root>

      <Button.Root
        asChild
        accessibilityHint='Increments the counter via slotted view'
        onPress={() => {
          setCount((c) => c + 1);
        }}
      >
        {/* Using Pressable here avoids the __DEV__ warning and ensures optimal keyboard focus */}
        <Pressable accessibilityRole='button'>
          <Text>Slotted Button</Text>
        </Pressable>
      </Button.Root>

      <Button.Root
        disabled
        accessibilityHint='This button is disabled'
        onPress={() => setCount((c) => c + 1)}
      >
        <Text>Disabled Button</Text>
      </Button.Root>
    </View>
  );
}
