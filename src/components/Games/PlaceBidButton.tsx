import Loader from 'react-loader-spinner';
import type { Auction_include_Nft } from '@/prisma/types';
import { computeAuctionStatus } from '@/utilities/status';
import Countdown from '@/components/Countdown';
import { useGetAuctionStateQuery } from '@/store/services/auctionsReducer';

interface Props {
  pending: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  auction: Auction_include_Nft;
}

export default function PlaceBidButton({ pending, onClick, auction }: Props) {
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  if (!auctionState) {
    return null;
  }
  const status = computeAuctionStatus({
    startTime: auction.startTime,
    endTime: auctionState.endTime,
    settled: auctionState.settled,
  });

  if (status === 'Live') {
    return (
      <button className='btn-place-bid' disabled={pending} onClick={onClick}>
        {pending ? (
          <>
            <Loader type='TailSpin' color='white' height='20px' width='20px' /> Bidding...
          </>
        ) : (
          'Place bid'
        )}
      </button>
    );
  }
  if (status === 'Upcoming') {
    return <Countdown endTime={auctionState?.endTime! * 1000} />;
  }
  if (status === 'Settled') {
    return (
      <button className='btn-place-bid' disabled data-status={status}>
        {status}
      </button>
    );
  }

  if (status === 'Done') {
    return (
      <button className='btn-place-bid' disabled data-status={status}>
        done
      </button>
    );
  }

  return null;
}
