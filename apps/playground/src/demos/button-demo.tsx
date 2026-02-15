import * as React from 'react';
import { View, Text } from 'react-native';
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
          setCount((c) => c + 1)
        }}
      >
        <View>
          <Text>Slotted Button</Text>
        </View>
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
