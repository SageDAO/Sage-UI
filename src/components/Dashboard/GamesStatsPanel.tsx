import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { useGetAuctionStateQuery } from '@/store/auctionsReducer';
import { useGetSalesEventsQuery } from '@/store/dashboardReducer';
import { useGetApprovedDropsQuery } from '@/store/dropsReducer';
import shortenAddress from '@/utilities/shortenAddress';
import { SaleEvent, SaleEventType } from '@prisma/client';
import Countdown from '../Countdown';
import LoaderDots from '../LoaderDots';

export function GamesStatsPanel() {
  const { data: drops, isLoading: isLoadingDrops } = useGetApprovedDropsQuery();
  const { data: sales, isLoading: isLoadingSales } = useGetSalesEventsQuery(undefined, {
    pollingInterval: 120000, // refetch sales data every two minutes
  });

  function download(filename: string, filecontents: string) {
    var element = document.createElement('a');
    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(filecontents)
    );
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  function downloadTickets(lotteryId: number) {
    const lotteryIdHexStr = '0x' + lotteryId.toString(16);
    var filecontents = 'txnHash,wallet,amount';
    getLotterySales(lotteryId).forEach((ticket: SaleEvent) => {
      filecontents += `\n${ticket.txHash},${ticket.buyer},${ticket.amountTokens}`;
    });
    download(`lottery_${lotteryId}_tickets_${getDateYYYYMMDDhhmmss()}.txt`, filecontents);
  }

  function downloadBids(auctionId: number) {
    const auctionIdHexStr = '0x' + auctionId.toString(16);
    var filecontents = 'txnHash,blockTimestamp,wallet,amount';
    // TODO use db data instead of graph
    // graphData.auctions.forEach((auction: any) => {
    //   if (auctionIdHexStr == auction.id) {
    //     auction.bids.forEach((item: any) => {
    //       filecontents += `\n${item.txnHash},${item.blockTimestamp},${item.bidder},${item.amount}`;
    //     });
    //   }
    // });
    download(`auction_${auctionId}_bids_${getDateYYYYMMDDhhmmss()}.txt`, filecontents);
  }

  if (isLoadingDrops || isLoadingSales) {
    return <LoaderDots />;
  }
  const getLotterySales = (id: number): SaleEvent[] => {
    const tickets = [];
    for (let e of sales) {
      if (e.eventType == SaleEventType.LOTTERY && e.eventId == id) {
        tickets.push(e);
      }
    }
    return tickets;
  };
  const getAuctionGameStats = (id: number) => {
    // for (let auction of graphData.auctions) {
    //   if (parseInt(auction.id) == id) return auction;
    // }
    return {};
  };
  return (
    <>
      {drops?.map((drop: Drop_include_GamesAndArtist, i) => (
        <div key={i} className='dashboard-game-stats__container'>
          <div
            className='dashboard-game-stats__item nft-tile dashboard-game-stats__tile'
            style={{ textAlign: 'center' }}
          >
            <img src={drop.bannerImageS3Path} width={180} height={180} />
            drop{' '}
            <span className='dashboard-game-stats__id dashboard-game-stats__tile'>{drop.id}</span>
          </div>
          <div className='dashboard-game-stats__item'>
            <table width='500'>
              <tbody>
                {drop.Lotteries.map((lottery, i) => {
                  const saleEvents = getLotterySales(lottery.id);
                  return (
                    <tr key={i} style={{ border: '1px solid gray', height: '95px' }}>
                      <td style={{ verticalAlign: 'middle' }}>
                        drawing <span className='dashboard-game-stats__id'>{lottery.id}</span>
                        <br />
                        {new Date(lottery.endTime).getTime() > new Date().getTime() ? (
                          <Countdown
                            className='status__countdown'
                            endTime={new Date(lottery.endTime).getTime()}
                          />
                        ) : (
                          `end date: ${new Date(lottery.endTime).toLocaleString()}`
                        )}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        entries sold: <span style={{ fontWeight: 'bold' }}>{saleEvents.length}</span>
                        { saleEvents.length > 0 && downloadIcon(() => downloadTickets(lottery.id)) }
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className='dashboard-game-stats__item' style={{ minWidth: '400px' }}>
            <table width='500'>
              <tbody>
                {drop.Auctions.map((auction, i) => {
                  const stats = getAuctionGameStats(auction.id);
                  if ('' == null) {
                    var endTime = Math.floor(new Date(auction.endTime).getTime() / 1000);
                  } else {
                    var endTime = Number(new Date().getTime() / 1000);
                  }
                  return (
                    <tr key={i} style={{ border: '1px solid gray', height: '95px' }}>
                      <td style={{ verticalAlign: 'middle' }}>
                        auction <span className='dashboard-game-stats__id'>{auction.id}</span>
                        <br />
                        {endTime > new Date().getTime() ? (
                          <Countdown className='status__countdown' endTime={endTime * 1000} />
                        ) : (
                          `end date: ${new Date(endTime * 1000).toLocaleString()}`
                        )}
                        {/*stats.bids?.length > 0 && downloadIcon(() => downloadBids(auction.id))*/}
                      </td>
                      <td style={{ verticalAlign: 'middle' }}>
                        {auctionContractState(auction.id)}
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

function auctionContractState(id: number) {
  const {data} = useGetAuctionStateQuery(id);
  if (data) {
    return <>highest bid: {data.highestBidNumber} ASH<br/>by {shortenAddress(data.highestBidder)}</>;
  }
  return '';
}

function downloadIcon(callback: any) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          backgroundColor: '#161619',
          width: '10px',
          padding: '3px',
          borderRadius: '3px',
          marginTop: '5px',
          cursor: 'pointer',
        }}
      >
        <a onClick={callback}>
          <img src='/icons/download.svg' width={20} className='dashboard-white-icon' />
        </a>
      </div>
    </div>
  );
}

function getDateYYYYMMDDhhmmss(): string {
  var d = new Date();
  return (
    d.getFullYear() +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    ('0' + d.getDate()).slice(-2) +
    ('0' + d.getHours()).slice(-2) +
    ('0' + d.getMinutes()).slice(-2) +
    ('0' + d.getSeconds()).slice(-2)
  );
}
