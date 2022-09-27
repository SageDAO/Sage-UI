import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { GamesStatsPanel } from './GamesStatsPanel';
import { UsersPanel } from './UsersPanel';
import { NewDropsPanel } from './NewDropsPanel';
import { ConfigPanel } from './ConfigPanel';
import PresetDropsPanel from './PresetDropsPanel';

export function DashBoardPage() {
  return (
    <div className='dashboard-page'>
      <Tabs>
        <TabList>
          <Tab className='dashboard-page__tab' selectedClassName='dashboard-page__tab--selected'>
            New Drops
          </Tab>
          <Tab className='dashboard-page__tab' selectedClassName='dashboard-page__tab--selected'>
            Preset Drops
          </Tab>
          <Tab className='dashboard-page__tab' selectedClassName='dashboard-page__tab--selected'>
            Games Stats
          </Tab>
          <Tab className='dashboard-page__tab' selectedClassName='dashboard-page__tab--selected'>
            Users
          </Tab>
          <Tab className='dashboard-page__tab' selectedClassName='dashboard-page__tab--selected'>
            Config
          </Tab>
        </TabList>
        <TabPanel className='dashboard-panel'>
          <NewDropsPanel />
        </TabPanel>
        <TabPanel className='dashboard-panel'>
          <PresetDropsPanel />
        </TabPanel>
        <TabPanel className='dashboard-panel'>
          <GamesStatsPanel />
        </TabPanel>
        <TabPanel className='dashboard-panel'>
          <UsersPanel />
        </TabPanel>
        <TabPanel className='dashboard-panel'>
          <ConfigPanel />
        </TabPanel>
      </Tabs>
    </div>
  );
}
