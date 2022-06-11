import { useRouter } from 'next/router';
import { Drop } from '@prisma/client';
import { basePathDrops } from '@/constants/paths';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import useTabs from '@/hooks/useTabs';
import type { Auction } from '@prisma/client';
import BidHistoryTable from './BidHistoryTable';

interface Props {
  drop: Drop;
  auction?: Auction;
}

// styles/layout/_game-page.scss
export default function GameInfo({ drop, auction }: Props) {
  const router = useRouter();
  const { handleTabsClick, selectedTabIndex } = useTabs();
  return (
    <Tabs className='game-info' selectedIndex={selectedTabIndex} onSelect={handleTabsClick}>
      <TabList className='game-info__tab-list'>
        {auction && (
          <Tab className='game-info__tab' selectedClassName='game-info__tab--active'>
            Bid history
          </Tab>
        )}
        <Tab className='game-info__tab' selectedClassName='game-info__tab--active'>
          About the Drop
        </Tab>
      </TabList>
      <div className='game-info__tab-panels-container'>
        {auction && (
          <TabPanel
            className='game-info__tab-panel'
            selectedClassName='game-info__tab-panel--active'
          >
            <BidHistoryTable auctionId={auction.id} />
          </TabPanel>
        )}
        <TabPanel className='game-info__tab-panel' selectedClassName='game-info__tab-panel--active'>
          <div className='game-info__about'>
            <h1 className='game-info__about-drop-title'>{drop.name}</h1>
            <p className='game-info__about-drop-description'>{drop.description}</p>
            <h1
              className='game-info__about-drop-link'
              onClick={() => router.push(`${basePathDrops}/${drop.id}`)}
            >
              See the full drop
            </h1>
          </div>
        </TabPanel>
      </div>
    </Tabs>
  );
}
