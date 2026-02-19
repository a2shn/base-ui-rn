import * as React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from './styles';

export const DebugTable = ({ data }: { data: Record<string, string> }) => {
  const styles = useStyles();

  return (
    <View style={styles.debugTable}>
      <View style={styles.debugHeaderRow}>
        <Text style={styles.debugHeader}>Prop Name</Text>
        <Text style={styles.debugHeader}>Resolved Value</Text>
      </View>

      {Object.entries(data).map(([key, value]) => (
        <View
          key={key}
          style={[
            styles.debugRow,
            key.startsWith('⚠') && styles.debugRowWarning,
          ]}
        >
          <Text style={styles.debugKey}>{key}</Text>
          <Text style={styles.debugValue}>{value}</Text>
        </View>
      ))}
    </View>
  );
};
