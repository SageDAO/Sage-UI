import { gql, useQuery } from '@apollo/client';
import { ethers } from 'ethers';

interface BidHistoryItem {
  bidder: string;
  amount: number;
}

interface BidHistoryTableProps {
  auctionId: number;
}

// styles/layout/_game-page.scss
export default function BidHistoryTable({ auctionId }: BidHistoryTableProps) {
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
    previousData,
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
          const animateFirst: string = previousData ? 'true' : 'false';
          if (isLoading) return null;
          return (
            <tr
              className='game-info__bid-history-item'
              key={amountFormatted}
              data-animate-first={animateFirst}
            >
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

function formatAmount(amount: any) {
  const amountString = String(amount);
  const amountBigNumber = ethers.BigNumber.from(amountString);

  const amountFormatted = ethers.utils.formatUnits(amountBigNumber);
  const amountFormattedShortened = parseFloat(amountFormatted).toFixed(6);
  return { amountFormatted, amountFormattedShortened };
}

function sortBidHistory(bidHistory: BidHistoryItem[]) {
  const bidHistoryCopy = [...bidHistory];
  function descendingAmount(a: BidHistoryItem, b: BidHistoryItem) {
    return +b.amount - +a.amount;
  }

  const sorted = bidHistoryCopy.sort(descendingAmount);
  const mostRecent = sorted.slice(0, 5);
  return mostRecent;
}
