import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Separator } from '@base-ui-rn/separator';
import { Gallery, Section, theme } from '@base-ui-rn/playbook';

export function SeparatorPlaybook() {
  return (
    <Gallery title='Separator'>
      <Section title='Horizontal'>
        <View style={styles.sep_row}>
          <Text style={styles.text}>Content Above</Text>
          <Separator style={styles.sep_horizontal} />
          <Text style={styles.text}>Content Below</Text>
        </View>
      </Section>

      <Section title='Vertical'>
        <View style={styles.sep_verticalRow}>
          <Text style={styles.text}>Left</Text>
          <Separator orientation='vertical' style={styles.sep_vertical} />
          <Text style={styles.text}>Right</Text>
        </View>
      </Section>

      <Section title='Decorative'>
        <View style={styles.sep_row}>
          <Text style={styles.text}>Content Above</Text>
          <Separator decorative style={styles.sep_horizontal} />
          <Text style={styles.text}>Content Below</Text>
        </View>
      </Section>
    </Gallery>
  );
}

const styles = StyleSheet.create({
  sep_row: {
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: 'center',
    alignSelf: 'center',
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
  sep_horizontal: {
    height: theme.border,
    backgroundColor: theme.colors.border,
    width: 200,
  },
  sep_verticalRow: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
    alignSelf: 'center',
  },
  sep_vertical: {
    width: theme.border,
    height: '100%',
    backgroundColor: theme.colors.border,
  },
});
