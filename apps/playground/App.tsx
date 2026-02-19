import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';

import { TogglePlaybook } from './src/toggle.playbook';
import { ButtonPlaybook } from './src/button.playbook';

const REGISTRY: PlaybookConfig = {
  Toggle: {
    title: 'Toggle',
    component: TogglePlaybook,
    testID: 'toggle',
  },
  Button: {
    title: 'Button',
    component: ButtonPlaybook,
    testID: 'button',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PlaybookApp registry={REGISTRY} />
    </SafeAreaProvider>
  );
}
