import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';

import { TogglePlaybook } from './src/toggle.playbook';
import { ButtonPlaybook } from './src/button.playbook';
import { ToggleGroupPlaybook } from './src/toggle-group.playbook';

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
  ToggleGroup: {
    title: 'Toggle Group',
    component: ToggleGroupPlaybook,
    testID: 'toggle-group',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PlaybookApp registry={REGISTRY} />
    </SafeAreaProvider>
  );
}
