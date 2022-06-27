import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { useGetApprovedDropsQuery } from '@/store/services/dropsReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { gql, useQuery } from '@apollo/client';
import { utils } from 'ethers';
import { stat } from 'fs/promises';
import Loader from 'react-loader-spinner';
import Countdown from '../Countdown';

const GAMES_QUERY = gql`
  query GetGames {
    lotteries {
      id
      status
      tickets {
        id
        txnHash
      }
      claimedPrizes {
        id
        txnHash
      }
      refunds {
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

export function GamesStatsPanel() {
  const { data: drops, isFetching: isLoadingFromDB } = useGetApprovedDropsQuery();
  const { loading: isLoadingFromSubgraph, data: graphData, startPolling } = useQuery(GAMES_QUERY);
  startPolling(3000);
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
      {drops?.map((drop: Drop_include_GamesAndArtist, i) => (
        <div key={i} className='dashboard-game-stats__container'>
          <div className='dashboard-game-stats__item nft-tile' style={{ textAlign: 'center' }}>
            <img src={drop.bannerImageS3Path} width={180} height={180} />
            drop <span className='dashboard-game-stats__id'>{drop.id}</span>
          </div>
          <div className='dashboard-game-stats__item' style={{ minWidth: '400px' }}>
            <table>
              <tbody>
                {drop.Lotteries.map((lottery, i) => {
                  const stats = getLotteryGameStats(lottery.id);
                  return (
                    <tr key={i}>
                      <td>
                        lottery <span className='dashboard-game-stats__id'>{lottery.id}</span>{' '}
                        <br />
                        status: {stats.status} <br />
                        {stats.status === 'Created' &&
                        new Date(lottery.endTime).getTime() > new Date().getTime() ? (
                          <Countdown
                            className='status__countdown'
                            endTime={new Date(lottery.endTime).getTime()}
                          />
                        ) : (
                          `ended ${new Date(lottery.endTime).toLocaleString()}`
                        )}
                        <br />
                        <a style={{ cursor: 'pointer', marginTop: '20px' }}>
                          <img
                            src='/icons/download.svg'
                            width={20}
                            className='dashboard-white-icon'
                          />
                        </a>
                      </td>
                      <td>
                        tickets sold: {stats.tickets?.length || 0} <br />
                        revenue (points):{' '}
                        {(stats.tickets?.length || 0) * lottery.costPerTicketPoints} PIXEL
                        <br />
                        revenue (tokens):{' '}
                        {(stats.tickets?.length || 0) * lottery.costPerTicketTokens} ASH <br />
                        prizes claimed: {stats.claimedPrizes?.length || 0}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='dashboard-game-stats__item' style={{ minWidth: '400px' }}>
            <table>
              <tbody>
                {drop.Auctions.map((auction, i) => {
                  const stats = getAuctionGameStats(auction.id);
                  if (stats.endTime == null) {
                    var endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
                  } else {
                    var endTime = Number(stats.endTime);
                  }
                  return (
                    <tr key={i}>
                      <td>
                        auction <span className='dashboard-game-stats__id'>{auction.id}</span>{' '}
                        <br />
                        status: {stats.status}
                        <br />
                        {stats.status === 'Created' && endTime > new Date().getTime() ? (
                          <Countdown className='status__countdown' endTime={endTime * 1000} />
                        ) : (
                          `ended ${new Date(endTime * 1000).toLocaleString()}`
                        )}
                      </td>
                      <td>
                        bids: {stats.bids?.length || 0} <br />
                        highest bid: {utils.formatUnits(stats.highestBid || 0)} ASH
                        <br />
                        highest bidder: {shortenAddress(stats.highestBidder)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </>
  );
}
