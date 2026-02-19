import type { ViewStyle } from 'react-native';

export interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  contentStyle?: ViewStyle;
  showAllProps?: boolean;
}
