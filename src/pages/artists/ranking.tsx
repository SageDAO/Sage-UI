import LoaderSpinner from '@/components/LoaderSpinner';
import { useGetListingNftsSalesDataQuery } from '@/store/dashboardReducer';
import { useGetApprovedDropsQuery } from '@/store/dropsReducer';
import { gql, useQuery } from '@apollo/client';

const GAMES_QUERY = gql`
  query GetGames {
    lotteries {
      id
      status
      tickets {
        id
        txnHash
        address
      }
      claimedPrizes {
        id
        txnHash
      }
    }
    auctions {
      id
      status
      highestBid
      highestBidder
      endTime
      bids {
        id
        txnHash
        bidder
        amount
        blockTimestamp
      }
    }
  }
`;

export default function ranking() {
  const { data: drops, isFetching: isLoadingDrops } = useGetApprovedDropsQuery();
  const { data: listingsSales, isLoading: isLoadingListingsSales } =
    useGetListingNftsSalesDataQuery();
  const { data: gamesSales, loading: isLoadingGamesSales } = useQuery(GAMES_QUERY);

  const getLotteryGameStats = (id: number) => {
    for (let lottery of gamesSales.lotteries) {
      if (parseInt(lottery.id) == id) return lottery;
    }
    return {};
  };
  const getAuctionGameStats = (id: number) => {
    for (let auction of gamesSales.auctions) {
      if (parseInt(auction.id) == id) return auction;
    }
    return {};
  };

  if (isLoadingDrops || isLoadingListingsSales || isLoadingGamesSales) {
    return (
      <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '50px' }}>
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className='ranking-page'>
      <h1 className='ranking-page__header'>Top Artists</h1>
      <table className='ranking-page__table'>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Artist</th>
            <th>Total Artwork Value</th>
            <th>Artworks Sold</th>
            <th>Highest Sale</th>
            <th>Average Sale</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>artist_a</td>
            <td>
              1,000,000 ASH
              <br />
              <span className='ranking-page__table__pixelvalue'>500,000 PIXEL</span>
            </td>
            <td>50</td>
            <td>25,000 ASH</td>
            <td>5,000 ASH</td>
          </tr>
          <tr>
            <td>2</td>
            <td>artist_b</td>
            <td>
              1,000,000 ASH
              <br />
              <span className='ranking-page__table__pixelvalue'>500,000 PIXEL</span>
            </td>
            <td>50</td>
            <td>25,000 ASH</td>
            <td>5,000 ASH</td>
          </tr>
          <tr>
            <td>3</td>
            <td>artist_c</td>
            <td>
              1,000,000 ASH
              <br />
              <span className='ranking-page__table__pixelvalue'>500,000 PIXEL</span>
            </td>
            <td>50</td>
            <td>25,000 ASH</td>
            <td>5,000 ASH</td>
          </tr>
          <tr>
            <td>4</td>
            <td>artist_d</td>
            <td>
              1,000,000 ASH
              <br />
              <span className='ranking-page__table__pixelvalue'>500,000 PIXEL</span>
            </td>
            <td>50</td>
            <td>25,000 ASH</td>
            <td>5,000 ASH</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
