import NftTile from '@/components/Tiles/NftTile';
import type { Lottery_include_Nft } from '@/prisma/types';
import { basePathLotteries } from '@/constants/paths';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import { User } from '@prisma/client';
import GetTicketsButton from '../Games/GetTicketsButton';
import { PfpImage } from '../Image';
import Status from '@/components/Status';
import { useGetUserQuery } from '@/store/services/user';
import { useSession } from 'next-auth/react';

type Props = {
  drawing: Lottery_include_Nft;
  artist: User;
  userTicketCount: number;
};

export default function DrawingTile({ drawing, artist, userTicketCount }: Props) {
  const { openModal, isOpen: isModalOpen, closeModal } = useModal(false);
  const { data: userData } = useGetUserQuery();
  const { status } = useSession();

  return (
    <NftTile
      button={
        <div className='nft-tile__btn-container'>
          <GetTicketsButton onClick={openModal} pending={false} />
        </div>
      }
      name={drawing.Nfts[0].name}
      subtitle={`${drawing.Nfts[0].numberOfEditions} editions`}
      imgSrc={drawing.Nfts[0].s3Path}
      imgLink={`${basePathLotteries}/${drawing.id}`}
    >
      {status === 'authenticated' && (
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
              You have{' '}
              <span className='nft-tile__user-position-display-game-highlight'>
                {userTicketCount}
              </span>
              tickets
            </div>
            <div className='nft-tile__user-position-display-game-status'>
              <Status endTime={drawing.endTime} startTime={drawing.startTime} settled={false} />
            </div>
          </div>
        </div>
      )}
      <GetTicketModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        lottery={drawing}
        nft={drawing.Nfts[0]}
        artist={artist}
      />
    </NftTile>
  );
}
