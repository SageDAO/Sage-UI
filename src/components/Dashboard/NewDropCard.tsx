import { DropWithArtist } from '@/prisma/types';
import { useApproveAndDeployDropMutation } from '@/store/dropsReducer';
import { Signer } from 'ethers';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import LoaderSpinner from '../LoaderSpinner';
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
    <div className='dashboard__tile'>
      <div className='dashboard__tile-img'>
        <BaseMedia src={drop.bannerImageS3Path} isVideo={false} />
      </div>
      <div className='dashboard__tile-details'>
        <div className='dashboard__tile-artist-pfp'>
          <PfpImage src={drop.NftContract.Artist.profilePicture} />
        </div>
        <div className='dashboard__tile-artist-info'>
          <div className='dashboard__tile-nft-name'>{drop.name}</div>
          <div className='dashboard__tile-artist-name'>by {drop.NftContract.Artist.username || 'anon'}</div>
        </div>
      </div>
      <button className='nft-tile__claimbutton' onClick={handleBtnClick} style={{ width: '100%' }}>
        {isDeploying ? (
          <>
            <LoaderSpinner /> 
            <span style={{ marginLeft: '15px' }}>Deploying, please wait...</span>
          </>
        ) : (
          <>Approve &amp; Deploy Drop</>
        )}
      </button>
    </div>
  );
}
