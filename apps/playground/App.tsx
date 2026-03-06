import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';

import { TogglePlaybook } from './src/toggle.playbook';
import { ButtonPlaybook } from './src/button.playbook';
import { ToggleGroupPlaybook } from './src/toggle-group.playbook';
import { SeparatorPlaybook } from './src/separator.playbook';
import { FocusRingPlaybook } from './src/focus-ring.playbook';
import { AvatarPlaybook } from './src/avatar.playbook';
import { MeterPlaybook } from './src/meter.playbook';

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
  Separator: {
    title: 'Separator',
    component: SeparatorPlaybook,
    testID: 'separator',
  },
  FocusRing: {
    title: 'Focus Ring',
    component: FocusRingPlaybook,
    testID: 'focus-ring',
  },
  Avatar: {
    title: 'Avatar',
    component: AvatarPlaybook,
    testID: 'avatar',
  },
  Meter: {
    title: 'Meter',
    component: MeterPlaybook,
    testID: 'meter',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PlaybookApp registry={REGISTRY} />
    </SafeAreaProvider>
  );
}
