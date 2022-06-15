import NftTile from '@/components/Tiles/NftTile';
import type { Auction_include_Nft } from '@/prisma/types';
import type { User } from '@prisma/client';
import { basePathAuctions } from '@/constants/paths';
import PlaceBidModal from '@/components/Modals/Games/PlaceBidModal';
import useModal from '@/hooks/useModal';
import { useGetAuctionStateQuery } from '@/store/services/auctionsReducer';
import PlaceBidButton from '@/components/Games/PlaceBidButton';
import { PfpImage } from '@/components/Image';
import { useGetUserQuery } from '@/store/services/user';
import Status from '@/components/Status';

type Props = {
  auction: Auction_include_Nft;
  artist: User;
};

// styles/components/_nft-tile.scss
export default function AuctionTile({ auction, artist }: Props) {
  const { openModal, isOpen: isModalOpen, closeModal } = useModal();
  const { data: auctionState } = useGetAuctionStateQuery(auction.id);
  const { data: userData } = useGetUserQuery();
  const isActive = auctionState?.settled || false;
  const hasTickets = true;
  return (
    <NftTile
      name={auction.Nft.name}
      button={
        <div className='nft-tile__btn-container'>
          <PlaceBidButton pending={false} auction={auction} onClick={openModal}></PlaceBidButton>
        </div>
      }
      subtitle={`Auction - ${auction.Nft.numberOfEditions} editions`}
      imgSrc={auction.Nft.s3Path}
      imgLink={`${basePathAuctions}/${auction.id}`}
    >
      {hasTickets === true && (
        <div className='nft-tile__user-position-display'>
          <div className='nft-tile__user-position-display-profile'>
            <div className='nft-tile__user-position-display-profile-pfp'>
              <PfpImage src={userData?.profilePicture} />
            </div>
            <div className='nft-tile__user-position-display-profile-handles'>
              <div className='nft-tile__user-position-display-profile-handles-name'>
                {userData?.displayName}
              </div>
              <div className='nft-tile__user-position-display-profile-handles-username'>
                @{userData?.username}
              </div>
            </div>
          </div>
          <div className='nft-tile__user-position-display-info'>
            <div className='nft-tile__user-position-display-game'>
              Current Bid{' '}
              <span className='nft-tile__user-position-display-game-highlight'>
                {auctionState.highestBidNumber} ETH
              </span>
            </div>
            <div className='nft-tile__user-position-display-game-status'>
              <Status endTime={auction.endTime} startTime={auction.startTime} settled={false} />
            </div>
          </div>
        </div>
      )}
      <PlaceBidModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        auction={auction}
        artist={artist}
      />
    </NftTile>
  );
}
