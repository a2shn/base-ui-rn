import React from 'react';
import { View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Main() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom, flex: 1 }}
    >
      <Text>BASE UI RN</Text>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: 'fff' }}>
      <Main />
    </SafeAreaProvider>
  );
}
