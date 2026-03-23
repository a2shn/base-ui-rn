import type { ViewStyle } from 'react-native';

/**
 * Props for a section in the playbook gallery.
 */
export interface SectionProps {
  /**
   * The title of the section.
   */
  title: string;
  /**
   * A description for the section.
   */
  description?: string;
  /**
   * The content of the section.
   */
  children: React.ReactNode;
  /**
   * Style applied to the section content.
   */
  contentStyle?: ViewStyle;
  /**
   * Whether to show all props in the documentation.
   * @default false
   */
  showAllProps?: boolean;
}
