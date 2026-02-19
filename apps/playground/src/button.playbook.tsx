import * as React from 'react';
import { Text } from 'react-native';
import { Button } from '@base-ui-rn/button';
import {
  Gallery,
  Section,
  usePlaybookToggles,
  LiveConsole,
} from '@base-ui-rn/playbook';

export function ButtonPlaybook() {
  const { count } = usePlaybookToggles({
    count: 0,
  });

  return (
    <Gallery title='Button'>
      <Section title='Counter Button'>
        <Button
          onPress={() => count.setValue(count.value + 1)}
          accessibilityHint='Increments the counter'
          testID='button-counter'
        >
          <Text>{count.value}</Text>
        </Button>

        <LiveConsole title='count' state={count} />
      </Section>

      <Section title='Disabled State'>
        <Button
          disabled
          accessibilityHint='Locked button'
          testID='button-disabled'
          accessibilityLabel='Disabled Button'
        >
          <Text>Disabled Button</Text>
        </Button>
      </Section>
    </Gallery>
  );
}
