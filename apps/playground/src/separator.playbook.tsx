import * as React from 'react';
import { View, Text } from 'react-native';
import { Separator } from '@base-ui-rn/separator';
import { Gallery, Section } from '@base-ui-rn/playbook';
import styles from './playbookStyles';

export function SeparatorPlaybook() {
  return (
    <Gallery title='Separator'>
      <Section title='Horizontal'>
        <View style={styles.sep_row}>
          <Text>Content Above</Text>
          <Separator style={styles.sep_horizontal} />
          <Text>Content Below</Text>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.sep_verticalRow}>
          <Text>Left</Text>
          <Separator orientation='vertical' style={styles.sep_vertical} />
          <Text>Right</Text>
        </View>
      </Section>

      <Section title='Decorative'>
        <View style={styles.sep_row}>
          <Text>Content Above</Text>
          <Separator decorative style={styles.sep_horizontal} />
          <Text>Content Below</Text>
        </View>
      </Section>
    </Gallery>
  );
}
