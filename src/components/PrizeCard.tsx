import { GamePrize } from '@/prisma/types';
import { useClaimAuctionNftMutation } from '@/store/services/auctionsReducer';
import { ClaimPrizeRequest, useClaimLotteryPrizeMutation } from '@/store/services/prizesReducer';
import { Signer } from 'ethers';
import { useSession } from 'next-auth/react';
import { useSigner } from 'wagmi';
import { BaseImage } from './Image';

interface Props {
  prize: GamePrize;
}

export default function PrizeCard({ prize }: Props) {
  const [claimLotteryPrize] = useClaimLotteryPrizeMutation();
  const [claimAuctionNft] = useClaimAuctionNftMutation();
  const { data: sessionData } = useSession();
  const { data: signer } = useSigner();

  const handleClaimPrizeClick = async () => {
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
    <>
      <div className='prize-card'>
        <div className='prize-card__image-container'>
          <BaseImage src={prize.s3Path} />
        </div>
        <div className='prize-card__interact'>
          <div className='prize-card__artist'>
            <h1 className='prize-card__artist-name'>{prize.nftName}</h1>
            <h1 className='prize-card__artist-username'>{prize.artistUsername}</h1>
          </div>
          <button className='prize-card__claim-button' onClick={handleClaimPrizeClick}>
            Claim NFT
          </button>
        </div>
      </div>
    </>
  );
}
