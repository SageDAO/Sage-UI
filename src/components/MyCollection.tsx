import { useSession } from 'next-auth/react';
import {
  useClaimAuctionNftMutation,
  useGetClaimedAuctionNftsQuery,
  useGetUnclaimedAuctionNftsQuery,
} from '@/store/services/auctionsReducer';
import {
  ClaimPrizeRequest,
  useClaimLotteryPrizeMutation,
  useGetClaimedPrizesQuery,
  useGetUnclaimedPrizesQuery,
} from '@/store/services/prizesReducer';
import { GamePrize } from '@/prisma/types';
import Loader from 'react-loader-spinner';
import { BaseMedia, PfpImage } from '@/components/Media';
import { Signer } from 'ethers';
import { useSigner } from 'wagmi';

export function MyCollection() {
  const { data: sessionData } = useSession();
  const { data: signer } = useSigner();
  const [claimLotteryPrize] = useClaimLotteryPrizeMutation();
  const [claimAuctionNft] = useClaimAuctionNftMutation();
  const { data: claimedPrizes, isFetching: fetchingClaimedPrizes } = useGetClaimedPrizesQuery();
  const { data: unclaimedPrizes, isFetching: fetchingUnclaimedPrizes } =
    useGetUnclaimedPrizesQuery();
  const { data: claimedAuctionNfts, isFetching: fetchingClaimedAuctionNfts } =
    useGetClaimedAuctionNftsQuery();
  const { data: unclaimedAuctionNfts, isFetching: fetchingUnclaimedAuctionNfts } =
    useGetUnclaimedAuctionNftsQuery();
  const myNfts = new Array().concat(
    unclaimedAuctionNfts,
    unclaimedPrizes,
    claimedAuctionNfts,
    claimedPrizes
  );

  if (
    fetchingClaimedPrizes ||
    fetchingUnclaimedPrizes ||
    fetchingClaimedAuctionNfts ||
    fetchingUnclaimedAuctionNfts
  ) {
    return (
      <div className='profile-page'>
        <br />
        <Loader type='ThreeDots' color='white' height={10} width={50} timeout={0} />
      </div>
    );
  }

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
    <div className='collection'>
      <div className='collection__header'>My Collection</div>
      {myNfts?.length == 0 && (
        <div style={{ marginTop: '50px', marginLeft: '50px', color: '#6f676e' }}>
          Nothing to showcase here (yet)!
        </div>
      )}
      <div className='collection__grid'>
        {myNfts?.map((item: GamePrize, index: number) => {
          return (
            <div className='collection__tile' key={index}>
              <div className='collection__tile-img'>
                <BaseMedia src={item.s3Path} isVideo={item.isVideo} isZoomable={true} />
              </div>
              <div className='collection__tile-details'>
							<div className="collection__tile-artist">
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
                  >
                    Claim NFT
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
