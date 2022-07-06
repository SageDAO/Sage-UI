import { DropWithArtist } from '@/prisma/types';
import { useApproveAndDeployDropMutation } from '@/store/services/dropsReducer';
import { Signer } from 'ethers';
import Loader from 'react-loader-spinner';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import { BaseMedia, PfpImage } from '../Media';

interface Props {
  drop: DropWithArtist;
}

export default function NewDropCard({ drop }: Props) {
  const { data: signer } = useSigner();
  const [approveAndDeployDrop, { isLoading: isDeploying }] = useApproveAndDeployDropMutation();

  const handleBtnClick = async () => {
    if (!signer) {
      toast.info('Sign In With Ethereum before continuing');
      return;
    }
    const result = await approveAndDeployDrop({ dropId: drop.id, signer: signer as Signer });
    if ((result as any).data) {
      toast.success('Drop Approved and Deployed!');
    } else {
      toast.error('Error deploying drop, check browser console for details.');
    }
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
        {isDeploying ? (
          <>
            <Loader type='TailSpin' color='white' height='15px' width='15px' /> 
            <span style={{ marginLeft: '15px' }}>Deploying, please wait...</span>
          </>
        ) : (
          <>Approve &amp; Deploy Drop</>
        )}
      </button>
    </div>
  );
}
