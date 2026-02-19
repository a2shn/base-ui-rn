import * as React from 'react';
import { View, Text } from 'react-native';
import { useStyles } from './styles';

export const ExtractionBadge = ({ method }: { method: string }) => {
  const styles = useStyles();

  const color =
    method === 'reactFiberKey'
      ? '#34C759'
      : method === 'internalInstanceHandle'
        ? '#FF9500'
        : method === 'reactInternals'
          ? '#007AFF'
          : '#FF3B30';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + '22', borderColor: color },
      ]}
    >
      <Text style={[styles.badgeText, { color }]}>{method}</Text>
    </View>
  );
};
