import { useState } from 'react';
import { TabProps, TabsProps, TabListProps, TabPanelProps } from 'react-tabs';

export default function useTabs() {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);
  const handleTabsClick: TabsProps['onSelect'] = (index, _last, _event) => {
    setSelectedTabIndex(index);
  };

  return { handleTabsClick, selectedTabIndex };
}
