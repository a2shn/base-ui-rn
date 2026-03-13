import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Separator } from '@base-ui-rn/separator';
import { Gallery, Section } from '@base-ui-rn/playbook';

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

const styles = StyleSheet.create({
  sep_row: {
    gap: 10,
    padding: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  sep_horizontal: {
    height: 1,
    backgroundColor: '#ccc',
    width: 200,
  },
  sep_verticalRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    gap: 10,
    padding: 10,
    alignSelf: 'center',
  },
  sep_vertical: {
    width: 1,
    height: '100%',
    backgroundColor: '#ccc',
  },
});
