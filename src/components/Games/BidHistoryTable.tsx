import shortenAddress from '@/utilities/shortenAddress';
import { gql, useQuery } from '@apollo/client';
import { ethers } from 'ethers';
import { useState } from 'react';

interface BidHistoryItem {
  bidder: string;
  amount: number;
  blockTimestamp: number;
}

interface Props {
  auctionId: number;
}

const ITEMS_TO_SHOW_STEPS = 5;
const ITEMS_TO_SHOW = [
  1 * ITEMS_TO_SHOW_STEPS,
  2 * ITEMS_TO_SHOW_STEPS,
  3 * ITEMS_TO_SHOW_STEPS,
  undefined,
];
type ItemsToShow = typeof ITEMS_TO_SHOW[number];

interface State {
  itemsToShow: ItemsToShow;
}

const initialState: State = {
  itemsToShow: 5,
};

// styles/layout/_game-page.scss
export default function BidHistoryTable({ auctionId }: Props) {
  const [state, setState] = useState(initialState);
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
    loading: isLoading,
    startPolling,
  } = useQuery(BID_HISTORY_QUERY, {
    variables: { auctionId: auctionIdHexStr },
  });
  if (isLoading || !graphData || !graphData.auction || !graphData.auction.bids) return null;
  const sortedBids = sortBidHistory(graphData.auction.bids, state.itemsToShow);
  startPolling(500);

  return (
    <>
      <fieldset className='game-info__bid-history-filters' name='items-to-show'>
        <span>showing {state.itemsToShow || sortedBids.length} results</span>
        <div className='game-info__bid-history-selections'>
          {ITEMS_TO_SHOW.map((i: ItemsToShow) => {
            const inputId: React.HTMLAttributes<HTMLInputElement>['id'] = String(i);
            const isChecked: boolean = i === state.itemsToShow;
            const handleInputSelect: React.ChangeEventHandler<HTMLInputElement> = () => {
              setState((prevState) => {
                return { ...prevState, itemsToShow: i };
              });
            };
            const label = inputId === 'undefined' ? 'all' : inputId;
            if (i !== undefined) {
              const multiples = Math.floor(sortedBids.length / +i);
              if (sortedBids.length < multiples * ITEMS_TO_SHOW_STEPS) {
                return null;
              }
            }
            return (
              <div key={inputId}>
                <input
                  type='radio'
                  id={inputId}
                  name='items-to-show'
                  checked={isChecked}
                  onChange={handleInputSelect}
                />
                <label htmlFor={inputId}>{label}</label>
              </div>
            );
          })}
        </div>
      </fieldset>
      <table className='game-info__bid-history-table'>
        <thead>
          <tr className='game-info__bid-history-header'>
            <th data-col='time'>TIME</th>
            <th data-col='bidder'>USER</th>
            <th data-col='amount'>AMOUNT</th>
          </tr>
        </thead>
        <tbody className='game-info__bid-history-body'>
          {sortedBids.map(({ bidder, amount, blockTimestamp }) => {
            const { amountFormatted, amountFormattedShortened } = formatAmount(amount);
            const dateTime = new Date(blockTimestamp * 1000).toLocaleString();
            const animateFirst: string = previousData ? 'true' : 'false';
            if (isLoading) return null;
            return (
              <tr
                className='game-info__bid-history-item'
                key={amountFormatted}
                data-animate-first={animateFirst}
              >
                <th data-col='time'>{dateTime}</th>
                <th data-col='bidder'>{shortenAddress(bidder)}</th>
                <th data-col='amount'>{amountFormattedShortened}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

function formatAmount(amount: any) {
  const amountString = String(amount);
  const amountBigNumber = ethers.BigNumber.from(amountString);

  const amountFormatted = ethers.utils.formatUnits(amountBigNumber);
  const amountFormattedShortened = parseFloat(amountFormatted).toFixed(6);
  return { amountFormatted, amountFormattedShortened };
}

function sortBidHistory(bidHistory: BidHistoryItem[], itemsToShow: ItemsToShow) {
  const bidHistoryCopy = [...bidHistory];
  function inDescendingAmountOrder(a: BidHistoryItem, b: BidHistoryItem) {
    return +b.amount - +a.amount;
  }

  const sorted = bidHistoryCopy.sort(inDescendingAmountOrder);
  const mostRecent = sorted.slice(0, itemsToShow);
  return mostRecent;
}
