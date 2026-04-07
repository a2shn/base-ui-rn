import { TabsIndicator } from './indicator';
import { TabsList } from './list';
import { TabPanel } from './panel';
import { Tab } from './tab';
import { TabsRoot } from './tabs';

export const Tabs = {
  Indicator: TabsIndicator,
  List: TabsList,
  Panel: TabPanel,
  Root: TabsRoot,
  Tab: Tab,
};

export * from './types';
export * from './use-tabs';
export * from './use-tabs-list';
export * from './use-tab';
export * from './use-tabs-indicator';
export * from './use-tab-panel';
