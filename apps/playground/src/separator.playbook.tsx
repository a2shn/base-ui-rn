import { Gallery, Section, theme } from '@base-ui-rn/playbook';
import { Separator } from '@base-ui-rn/separator';
import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
  sep_horizontal: {
    backgroundColor: theme.colors.border,
    height: theme.border,
    width: 200,
  },
  sep_row: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sep_vertical: {
    backgroundColor: theme.colors.border,
    height: '100%',
    width: theme.border,
  },
  sep_verticalRow: {
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'row',
    gap: theme.spacing.md,
    height: 40,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.textPrimary,
    fontSize: theme.font.size.md,
  },
});
