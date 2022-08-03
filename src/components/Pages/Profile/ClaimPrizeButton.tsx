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
      claimLotteryPrize({
        lotteryId: lotteryId,
        proof: lotteryProof as string,
        walletAddress: userData?.walletAddress as string,
        uri: uri,
        signer: signer as Signer,
        nftId: nftId,
      });
    } else {
      claimAuctionPrize({ id: auctionId as number, signer: signer as Signer });
    }
  }
  return (
    <button disabled={isClaimAuctionPrizeLoading || isClaimLotteryPrizeLoading} onClick={handleInteractButtonClick} className='notifications-panel__interact-button'>
      mint/claim
    </button>
  );
}
