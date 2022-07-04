import { BaseMedia, PfpImage } from '../Media';
import { ClaimPrizeRequest, useClaimLotteryPrizeMutation } from '@/store/services/prizesReducer';
import { GamePrize } from '@/prisma/types';
import { useClaimAuctionNftMutation } from '@/store/services/auctionsReducer';
import { useSession } from 'next-auth/react';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';

interface Props {
  item: GamePrize;
}

export default function CollectionTile({ item }: Props) {
  const { data: sessionData } = useSession();
  const { data: signer } = useSigner();
  const [claimLotteryPrize, { isLoading: isClaimLotteryPrizeLoading }] =
    useClaimLotteryPrizeMutation();
  const [claimAuctionNft, { isLoading: isClaimAuctionNftLoading }] = useClaimAuctionNftMutation();

  const handleClaimPrizeClick = async (prize: GamePrize) => {
    if (prize.auctionId) {
      await claimAuctionNft({ id: prize.auctionId, signer: signer as Signer });
    } else {
      await claimLotteryPrize({
        lotteryId: prize.lotteryId,
        nftId: prize.nftId,
        ticketNumber: prize.lotteryTicketNumber,
        proof: prize.lotteryProof,
        walletAddress: sessionData?.address,
        signer: signer as Signer,
      } as ClaimPrizeRequest);
    }
  };

  return (
    <div className='collection__tile'>
      <div className='collection__tile-img'>
        <BaseMedia src={item.s3Path} isVideo={item.isVideo} isZoomable={true} />
      </div>
      <div className='collection__tile-details'>
        <div className='collection__tile-artist'>
          <div className='collection__tile-artist-pfp'>
            <PfpImage src={item.artistProfilePicture} />
          </div>
          <div className='collection__tile-artist-info'>
            <div className='collection__tile-nft-name'>{item.nftName}</div>
            <div className='collection__tile-artist-name'>by {item.artistDisplayName}</div>
          </div>
        </div>
        {!item.claimedAt && (
          <button
            className='collection__tile-claim-button'
            onClick={() => handleClaimPrizeClick(item)}
            disabled={isClaimAuctionNftLoading || isClaimLotteryPrizeLoading}
          >
            Claim NFT
          </button>
        )}
      </div>
    </div>
  );
}