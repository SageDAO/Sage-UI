import NftTile from '@/components/Tiles/NftTile';
import type { Lottery_include_Nft } from '@/prisma/types';
import { basePathLotteries } from '@/constants/paths';
import GetTicketModal from '@/components/Modals/Games/GetTicketModal';
import useModal from '@/hooks/useModal';
import type { User } from '@prisma/client';
import GetTicketsButton from '../Games/GetTicketsButton';
import { useGetUserQuery } from '@/store/services/user';
import { PfpImage } from '../Image';
import Status from '../Status';

type Props = {
  lottery: Lottery_include_Nft;
  artist: User;
};

export default function LotteryTile({ lottery, artist }: Props) {
  const { openModal, isOpen: isModalOpen, closeModal } = useModal(false);
  const { data: userData } = useGetUserQuery();
  const isActive = false;
  const hasTickets = true;
  return (
    <NftTile
      button={
        <div className='nft-tile__btn-container'>
          <GetTicketsButton onClick={openModal} pending={false} />
        </div>
      }
      name={lottery.Nfts[0].name}
      subtitle={`${String(lottery.Nfts.length)} NFTs`}
      imgSrc={lottery.Nfts[0].s3Path}
      imgLink={`${basePathLotteries}/${lottery.id}`}
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
              You have <span className='nft-tile__user-position-display-game-highlight'>{0}</span>
              tickets
            </div>
            <div className='nft-tile__user-position-display-game-status'>
              <Status endTime={lottery.endTime} startTime={lottery.startTime} settled={false} />
            </div>
          </div>
        </div>
      )}
      <GetTicketModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        lottery={lottery}
        artist={artist}
        nft={lottery.Nfts[0]}
      />
    </NftTile>
  );
}
