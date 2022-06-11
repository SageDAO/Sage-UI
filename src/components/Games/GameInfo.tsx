import { useRouter } from 'next/router';
import { Drop } from '@prisma/client';
import { basePathDrops } from '@/constants/paths';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import useTabs from '@/hooks/useTabs';
import type { Auction } from '@prisma/client';
import { gql, useQuery } from '@apollo/client';
import { ethers } from 'ethers';

interface Props {
  drop: Drop;
  auction?: Auction;
}

function formatAmount(amount: any) {
  const amountString = String(amount);
  const amountBigNumber = ethers.BigNumber.from(amountString);

  const amountFormatted = ethers.utils.formatUnits(amountBigNumber);
  const amountFormattedShortened = parseFloat(amountFormatted).toFixed(6);
  return { amountFormatted, amountFormattedShortened };
}

interface BidHistoryItem {
  bidder: string;
  amount: number;
}

function sortBidHistory(bidHistory: BidHistoryItem[]) {
  const bidHistoryCopy = [...bidHistory];
  const sorted = bidHistoryCopy.sort((a, b) => +b.amount - +a.amount);
  return sorted;
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

interface BidHistoryTableProps {
  auctionId: number;
}

function BidHistoryTable({ auctionId }: BidHistoryTableProps) {
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
  const auctionIdHexStr = '0x' + auctionId.toString(16);
  const {
    data: { auction: { bids } } = { auction: { bids: [] } },
    loading: isLoading,
    startPolling,
  } = useQuery(BID_HISTORY_QUERY, {
    variables: { auctionId: auctionIdHexStr },
  });
  // if (bidHistoryQueryLoading || !data || !data.auction || !data.auction.bids) return null;
  const sortedBids = sortBidHistory(bids);
  startPolling(500);

  return (
    <table className='game-info__bid-history-table'>
      <thead>
        <tr className='game-info__bid-history-header'>
          <th data-col='time'>TIME</th>
          <th data-col='bidder'>USER</th>
          <th data-col='amount'>AMOUNT</th>
        </tr>
      </thead>
      <tbody className='game-info__bid-history-body'>
        {sortedBids.map(({ bidder, amount }) => {
          const { amountFormatted, amountFormattedShortened } = formatAmount(amount);
          if (isLoading) return null;
          return (
            <tr className='game-info__bid-history-item' key={amountFormatted}>
              <th data-col='time'>time</th>
              <th data-col='bidder'>{bidder}</th>
              <th data-col='amount'>{amountFormattedShortened}</th>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
