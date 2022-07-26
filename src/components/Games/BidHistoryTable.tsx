import shortenAddress from '@/utilities/shortenAddress';
import { gql, useQuery } from '@apollo/client';
import { ethers } from 'ethers';

interface BidHistoryItem {
  bidder: string;
  amount: number;
  blockTimestamp: number;
}

interface Props {
  auctionId: number;
  isActive: boolean;
}

// styles/layout/_game-page.scss
export default function BidHistoryTable({ auctionId, isActive }: Props) {
  const BID_HISTORY_QUERY = gql`
    query GetBidHistory($auctionId: String) {
      auction(id: $auctionId) {
        bids {
          bidder
          amount
          blockTimestamp
        }
      }
    }
  `;

  const auctionIdHexStr = '0x' + auctionId.toString(16);
  const {
    data: graphData,
    previousData,
    startPolling,
  } = useQuery(BID_HISTORY_QUERY, {
    variables: { auctionId: auctionIdHexStr },
  });
  if (!graphData || !graphData.auction || !graphData.auction.bids) return null;
  const sortedBids = sortBidHistory(graphData.auction.bids);
  startPolling(500);

  return (
    <table className='games-modal__bid-history-table' data-active={isActive}>
      <tbody className='games-modal__bid-history-data'>
        {sortedBids.map(({ bidder, amount, blockTimestamp }) => {
          const { amountFormatted, amountFormattedShortened } = formatAmount(amount);
          const dateTime = new Date(blockTimestamp * 1000).toLocaleString();
          const animateFirst: string = previousData ? 'true' : 'false';
          if (!isActive) return null;
          return (
            <tr
              className='games-modal__bid-history-row'
              key={amountFormatted}
              data-animate-first={animateFirst}
            >
              <th data-col='time'>{dateTime}</th>
              <th data-col='bidder'>{shortenAddress(bidder)}</th>
              <th data-col='amount'>{amountFormattedShortened} ASH</th>
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
  function inDescendingAmountOrder(a: BidHistoryItem, b: BidHistoryItem) {
    return +b.amount - +a.amount;
  }

  const sorted = bidHistoryCopy.sort(inDescendingAmountOrder);
  const firstTen = sorted.slice(0, 10);

  return firstTen;
}
