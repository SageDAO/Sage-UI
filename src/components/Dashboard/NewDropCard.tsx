import { DropWithArtist } from '@/prisma/types';
import { useApproveAndDeployDropMutation } from '@/store/services/dropsReducer';
import { Signer } from 'ethers';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import { BaseMedia, PfpImage } from '../Media';

interface Props {
  drop: DropWithArtist;
}

export default function NewDropCard({ drop }: Props) {
  const [approveAndDeployDrop] = useApproveAndDeployDropMutation();
  const { data: signer } = useSigner();

  const handleBtnClick = async () => {
    await approveAndDeployDrop({ dropId: drop.id, signer: signer as Signer });
    toast.success('Drop Approved!');
  };

  return (
    <div className='collection__tile'>
      <div className='collection__tile-img'>
        <BaseMedia src={drop.bannerImageS3Path} isVideo={false} />
      </div>
      <div className='collection__tile-details'>
        <div className='collection__tile-artist-pfp'>
          <PfpImage src={drop.Artist.profilePicture} />
        </div>
        <div className='collection__tile-artist-info'>
          <div className='collection__tile-nft-name'>{drop.name}</div>
          <div className='collection__tile-artist-name'>by {drop.Artist.displayName || 'anon'}</div>
        </div>
      </div>
      <button className='nft-tile__claimbutton' onClick={handleBtnClick} style={{ width: '100%' }}>
        Approve &amp; Deploy Drop
      </button>
    </div>
  );
}
