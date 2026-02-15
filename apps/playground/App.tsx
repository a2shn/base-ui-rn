import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ButtonDemo } from './src/demos/button-demo';

const DEMOS = {
  Button: ButtonDemo,
} as const;

type DemoKey = keyof typeof DEMOS;

function Main() {
  const insets = useSafeAreaInsets();
  const [currentDemo, setCurrentDemo] = useState<DemoKey | null>(null);

  if (currentDemo) {
    const ActiveDemo = DEMOS[currentDemo];
    return (
      <View
        style={{
          flex: 1,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        }}
      >
        <ActiveDemo />
      </View>
    );
  }

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <Text>BASE UI RN</Text>
      <ScrollView>
        {(Object.keys(DEMOS) as DemoKey[]).map((key) => (
          <TouchableOpacity
            key={key}
            accessibilityRole='button'
            accessibilityHint={`Mapss to the ${key} demo`}
            onPress={() => setCurrentDemo(key)}
          >
            <Text>{key}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Main />
    </SafeAreaProvider>
  );
}
