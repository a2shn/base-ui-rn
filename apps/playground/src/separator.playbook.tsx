import * as React from 'react';
import { View, Text } from 'react-native';
import { Separator } from '@base-ui-rn/separator';
import { Gallery, Section } from '@base-ui-rn/playbook';

export function SeparatorPlaybook() {
  return (
    <Gallery title='Separator'>
      <Section title='Horizontal'>
        <View style={{ gap: 10, padding: 10 }}>
          <Text>Content Above</Text>
          <Separator style={{ height: 1, backgroundColor: '#ccc', width: '100%' }} />
          <Text>Content Below</Text>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={{ flexDirection: 'row', height: 40, alignItems: 'center', gap: 10, padding: 10 }}>
          <Text>Left</Text>
          <Separator orientation='vertical' style={{ width: 1, height: '100%', backgroundColor: '#ccc' }} />
          <Text>Right</Text>
        </View>
      </Section>

      <Section title='Decorative (Hidden from A11y)'>
        <View style={{ gap: 10, padding: 10 }}>
          <Text>Content Above</Text>
          <Separator decorative style={{ height: 1, backgroundColor: '#ccc', width: '100%' }} />
          <Text>Content Below</Text>
        </View>
      </Section>
    </Gallery>
  );
}
