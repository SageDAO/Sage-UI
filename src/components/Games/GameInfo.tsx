import { useRouter } from 'next/router';
import { Drop } from '@prisma/client';
import { basePathDrops } from '@/constants/paths';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import useTabs from '@/hooks/useTabs';
import type { Auction } from '@prisma/client';
import { gql, useQuery } from '@apollo/client';
import shortenAddress from '@/utilities/shortenAddress';

interface Props {
  drop: Drop;
  auction?: Auction;
}

// styles/layout/_game-page.scss
export default function GameInfo({ drop, auction }: Props) {
  const router = useRouter();
  const { handleTabsClick, selectedTabIndex } = useTabs();

  const BID_HISTORY_QUERY = gql`
    query GetBidHistory($auctionId: String) {
      auction(id: $auctionId) {
        bids {
          bidder
          amount
        }
      }
    }
  `;
  const auctionIdHexStr = '0x' + auction?.id.toString(16);
  const { data } = useQuery(BID_HISTORY_QUERY, {
    variables: { auctionId: auctionIdHexStr },
  });

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
            <table className='game-info__bid-history-table'>
              <tr className='game-info__bid-history-header'>
                <th>TIME</th>
                <th>USER</th>
                <th>AMOUNT</th>
              </tr>

              {data &&
                data.auction &&
                data.auction.bids.map(({ bidder, amount }, i: number) => (
                  // <div key={i}>
                  //   <p>
                  //     {shortenAddress(bidder)} -&gt; {amount}
                  //   </p>
                  // </div>
                  <tr className='game-info__bid-history-item' key={i}>
                    <th>time</th>
                    <th>{bidder}</th>
                    <th>{amount}</th>
                  </tr>
                ))}
            </table>
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
