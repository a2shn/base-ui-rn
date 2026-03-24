import { ShortcutProvider } from '@base-ui-rn/keyboard-shortcuts';
import { PlaybookApp, type PlaybookConfig } from '@base-ui-rn/playbook';
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AccordionPlaybook } from './src/accordion.playbook';
import { AvatarPlaybook } from './src/avatar.playbook';
import { ButtonPlaybook } from './src/button.playbook';
import { CollapsiblePlaybook } from './src/collapsible.playbook';
import { FocusRingPlaybook } from './src/focus-ring.playbook';
import { InputPlaybook } from './src/input.playbook';
import { KeyboardShortcutsPlaybook } from './src/keyboard-shortcuts.playbook';
import { MeterPlaybook } from './src/meter.playbook';
import { ProgressPlaybook } from './src/progress.playbook';
import { SeparatorPlaybook } from './src/separator.playbook';
import { SliderPlaybook } from './src/slider.playbook';
import { TabsPlaybook } from './src/tabs.playbook';
import { ToggleGroupPlaybook } from './src/toggle-group.playbook';
import { TogglePlaybook } from './src/toggle.playbook';

const REGISTRY: PlaybookConfig = {
  Accordion: {
    component: AccordionPlaybook,
    testID: 'accordion',
    title: 'Accordion',
  },
  Avatar: {
    component: AvatarPlaybook,
    testID: 'avatar',
    title: 'Avatar',
  },
  Button: {
    component: ButtonPlaybook,
    testID: 'button',
    title: 'Button',
  },
  Collapsible: {
    component: CollapsiblePlaybook,
    testID: 'collapsible',
    title: 'Collapsible',
  },
  FocusRing: {
    component: FocusRingPlaybook,
    testID: 'focus-ring',
    title: 'Focus Ring',
  },
  Input: {
    component: InputPlaybook,
    testID: 'input',
    title: 'Input',
  },
  Meter: {
    component: MeterPlaybook,
    testID: 'meter',
    title: 'Meter',
  },
  Progress: {
    component: ProgressPlaybook,
    testID: 'progress',
    title: 'Progress',
  },
  Separator: {
    component: SeparatorPlaybook,
    testID: 'separator',
    title: 'Separator',
  },
  Shortcuts: {
    component: KeyboardShortcutsPlaybook,
    testID: 'shortcuts',
    title: 'Keyboard Shortcuts',
  },
  Slider: {
    component: SliderPlaybook,
    testID: 'slider',
    title: 'Slider',
  },
  Tabs: {
    component: TabsPlaybook,
    testID: 'tabs',
    title: 'Tabs',
  },
  Toggle: {
    component: TogglePlaybook,
    testID: 'toggle',
    title: 'Toggle',
  },
  ToggleGroup: {
    component: ToggleGroupPlaybook,
    testID: 'toggle-group',
    title: 'Toggle Group',
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
