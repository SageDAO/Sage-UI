import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { useGetApprovedDropsQuery } from '@/store/services/dropsReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import Loader from 'react-loader-spinner';

const GAMES_QUERY = gql`
  query GetGames {
    lotteries {
      id
      status
      tickets {
        id
      }
      claimedPrizes {
        id
      }
    }
    auctions {
      id
      status
      highestBid
      highestBidder
      bids {
        id
        bidder
        amount
        blockTimestamp
      }
    }
  }
`;

export function GamesStatsPanel() {
  const { data: drops, isFetching: isLoadingFromDB } = useGetApprovedDropsQuery();
  const { loading: isLoadingFromSubgraph, data: graphData } = useQuery(GAMES_QUERY);
  if (isLoadingFromDB || isLoadingFromSubgraph) {
    return (
      <div style={{ margin: '25px auto 25px' }}>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }
  const getLotteryGameStats = (id: number) => {
    for (let lottery of graphData.lotteries) {
      if (parseInt(lottery.id) == id) return lottery;
    }
    return {};
  };
  const getAuctionGameStats = (id: number) => {
    for (let auction of graphData.auctions) {
      if (parseInt(auction.id) == id) return auction;
    }
    return {};
  };
  return (
    <>
      {drops?.map((drop: Drop_include_GamesAndArtist) => (
        <div className='dashboard-game-stats__container'>
          <div className='dashboard-game-stats__item nft-tile' style={{ textAlign: 'center' }}>
            <img src={drop.bannerImageS3Path} width={180} height={180} />
            drop <span className='dashboard-game-stats__id'>{drop.id}</span>
          </div>
          <div className='dashboard-game-stats__item' style={{ minWidth: '400px' }}>
            <table>
              {drop.Lotteries.map((lottery) => {
                const stats = getLotteryGameStats(lottery.id);
                return (
                  <tr>
                    <td>
                      lottery <span className='dashboard-game-stats__id'>{lottery.id}</span> <br />
                      status: {stats.status} <br />
                      time left: XXX
                    </td>
                    <td>
                      tickets sold: {stats.tickets.length} <br />
                      revenue (points): XXX PIXEL
                      <br />
                      revenue (tokens): XXX ASH <br />
                      prizes claimed: {stats.claimedPrizes.length}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
          <div className='dashboard-game-stats__item' style={{ minWidth: '400px' }}>
            <table>
              {drop.Auctions.map((auction) => {
                const stats = getAuctionGameStats(auction.id);
                return (
                  <tr>
                    <td>
                      auction <span className='dashboard-game-stats__id'>{auction.id}</span> <br />
                      status: {stats.status}
                      <br />
                      time left: XXX
                    </td>
                    <td>
                      bids: {stats.bids.length} <br />
                      highest bid: {utils.formatUnits(stats.highestBid)} ASH<br />
                      highest bidder: {shortenAddress(stats.highestBidder)}
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
