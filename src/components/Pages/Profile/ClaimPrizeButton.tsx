import { useClaimLotteryPrizeMutation } from '@/store/prizesReducer';
import { Signer } from 'ethers';
import { useClaimAuctionMutation } from '@/store/auctionsReducer';
import { useGetUserQuery } from '@/store/usersReducer';
import { useSigner } from 'wagmi';
import { GamePrize } from '@/prisma/types';
import { toast } from 'react-toastify';

interface Props {
  gamePrize: GamePrize;
}

export default function ClaimPrizeButton({ gamePrize }: Props) {
  const { lotteryId, lotteryProof, uri, nftId, auctionId } = gamePrize;
  const [claimLotteryPrize, { isLoading: isClaimLotteryPrizeLoading }] =
    useClaimLotteryPrizeMutation();
  const [claimAuctionPrize, { isLoading: isClaimAuctionPrizeLoading }] = useClaimAuctionMutation();
  const { data: userData } = useGetUserQuery();
  const { data: signer } = useSigner();
  async function handleInteractButtonClick() {
    if (!signer) {
      toast.info('Please sign in with a wallet.');
      return;
    }
    if (lotteryId) {
      try {
        claimLotteryPrize({
          lotteryId: lotteryId,
          proof: lotteryProof as string,
          walletAddress: userData?.walletAddress as string,
          uri: uri,
          signer: signer as Signer,
          nftId: nftId,
        });
      } catch (e) {
        console.error(e);
      }
    } else if (auctionId) {
      claimAuctionPrize({ id: auctionId, signer: signer as Signer });
    }
  }

  if (gamePrize.claimedAt) {
    return (
      <button disabled={true} className='notifications-panel__interact-button'>
        minted/claimed
      </button>
    );
  }
  return (
    <button
      disabled={isClaimAuctionPrizeLoading || isClaimLotteryPrizeLoading}
      onClick={handleInteractButtonClick}
      className='notifications-panel__interact-button'
    >
      mint/claim
    </button>
  );
}
