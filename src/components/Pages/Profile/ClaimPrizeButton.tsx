import { useClaimLotteryPrizeMutation } from '@/store/prizesReducer';
import { Signer } from 'ethers';
import { useClaimAuctionNftMutation } from '@/store/auctionsReducer';
import { useGetUserQuery } from '@/store/usersReducer';
import { useSigner } from 'wagmi';
import { GamePrize } from '@/prisma/types';

interface Props {
  gamePrize: GamePrize;
}

export default function ClaimPrizeButton({ gamePrize }: Props) {
  const { lotteryId, lotteryProof, uri, nftId, auctionId } = gamePrize;
  const [claimLotteryPrize, { isLoading: isClaimLotteryPrizeLoading }] =
    useClaimLotteryPrizeMutation();
  const [claimAuctionPrize, { isLoading: isClaimAuctionPrizeLoading }] =
    useClaimAuctionNftMutation();
  const { data: userData } = useGetUserQuery();
  const { data: signer } = useSigner();
  async function handleInteractButtonClick() {
    if (lotteryId) {
      if (!signer) return;
      if (!userData) return;
      if (!lotteryProof) return;
      try {
        claimLotteryPrize({
          lotteryId: lotteryId,
          proof: lotteryProof,
          walletAddress: userData?.walletAddress,
          uri: uri,
          signer: signer,
          nftId: nftId,
        });
      } catch (e) {
        console.error(e);
      }
    } else if (auctionId) {
      claimAuctionPrize({ id: auctionId, signer: signer as Signer });
    }
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
