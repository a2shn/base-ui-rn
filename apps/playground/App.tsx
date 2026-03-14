import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';
import { ShortcutProvider } from '@base-ui-rn/keyboard-shortcuts';

import { TogglePlaybook } from './src/toggle.playbook';
import { ButtonPlaybook } from './src/button.playbook';
import { ToggleGroupPlaybook } from './src/toggle-group.playbook';
import { SeparatorPlaybook } from './src/separator.playbook';
import { FocusRingPlaybook } from './src/focus-ring.playbook';
import { AvatarPlaybook } from './src/avatar.playbook';
import { MeterPlaybook } from './src/meter.playbook';
import { ProgressPlaybook } from './src/progress.playbook';
import { KeyboardShortcutsPlaybook } from './src/keyboard-shortcuts.playbook';
import { AccordionPlaybook } from './src/accordion.playbook';
import { TabsPlaybook } from './src/tabs.playbook';
import { SwitchPlaybook } from './src/switch.playbook';

const REGISTRY: PlaybookConfig = {
  Switch: {
    title: 'Switch',
    component: SwitchPlaybook,
    testID: 'switch',
  },
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
  Progress: {
    title: 'Progress',
    component: ProgressPlaybook,
    testID: 'progress',
  },
  Shortcuts: {
    title: 'Keyboard Shortcuts',
    component: KeyboardShortcutsPlaybook,
    testID: 'shortcuts',
  },
  Accordion: {
    title: 'Accordion',
    component: AccordionPlaybook,
    testID: 'accordion',
  },
  Tabs: {
    title: 'Tabs',
    component: TabsPlaybook,
    testID: 'tabs',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ShortcutProvider>
        <PlaybookApp registry={REGISTRY} />
      </ShortcutProvider>
    </SafeAreaProvider>
  );
}
