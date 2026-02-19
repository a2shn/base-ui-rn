import * as React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useStyles } from './styles';

/**
 * Scrollable container used to group and display related sections.
 *
 * @param title
 * Heading displayed at the top of the gallery.
 *
 * @param children
 * Content rendered below the header.
 *
 * @example
 * ```tsx
 * <Gallery title="Buttons">
 *   <Section title="Primary">
 *     <Button.Root accessibilityHint="Submits the form" />
 *   </Section>
 * </Gallery>
 * ```
 */
export const Gallery = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const styles = useStyles();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>{title}</Text>
      <View style={styles.divider} />
      {children}
    </ScrollView>
  );
};
