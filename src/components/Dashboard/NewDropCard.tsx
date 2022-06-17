import { DropWithArtist } from '@/prisma/types';
import { useApproveDropMutation } from '@/store/services/dropsReducer';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { PfpImage } from '../Media';

interface Props {
  drop: DropWithArtist;
}

export default function NewDropCard({ drop }: Props) {
  const [approveDrop] = useApproveDropMutation();

  const handleApproveDropClick = async () => {
    await approveDrop(drop.id);
    toast.success('Drop Approved!');
  };

  return (
    <div className='collection__tile'>
      <div className='collection__tile-img'>
        <Image src={drop.bannerImageS3Path || '/sample/0.png'} width={200} height={200} />
      </div>
      <div className='collection__tile-details'>
        <div className='collection__tile-artist-pfp'>
          {/* <PfpImage src={drop.Artist.profilePicture} /> */}
        </div>
        <div className='collection__tile-artist-info'>
          <div className='collection__tile-nft-name'>{drop.name}</div>
          <div className='collection__tile-artist-name'>by {drop.Artist.displayName || 'anon'}</div>
        </div>
      </div>
      <button
        className='nft-tile__claimbutton'
        onClick={handleApproveDropClick}
        style={{ width: '100%' }}
      >
        Approve Drop
      </button>
    </div>
  );
}
