import { DropWithArtist } from '@/prisma/types';
import { useApproveAndDeployDropMutation, useDeleteDropMutation } from '@/store/dropsReducer';
import { Signer } from 'ethers';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import LoaderSpinner from '../LoaderSpinner';
import { BaseMedia, PfpImage } from '../Media/BaseMedia';

interface Props {
  drop: DropWithArtist;
}

export default function NewDropCard({ drop }: Props) {
  const { data: signer } = useSigner();
  const [approveAndDeployDrop, { isLoading: isDeploying }] = useApproveAndDeployDropMutation();
  const [deleteDrop, { isLoading: isDeleting }] = useDeleteDropMutation();

  const handleApproveBtnClick = async () => {
    if (!signer) {
      toast.info('Sign In With Ethereum before continuing');
      return;
    }
    const result = await approveAndDeployDrop({ dropId: drop.id, signer: signer as Signer });
    if ((result as any).data) {
      toast.success(`Drop ${drop.id} has been deployed!`);
    } else {
      toast.error('Error deploying drop, check browser console for details.');
    }
  };

  const handleDeleteBtnClick = async () => {
    if (!signer) {
      toast.info('Sign In With Ethereum before continuing');
      return;
    }
    if (confirm(`Permanently delete drop ${drop.id}?`)) {
      await deleteDrop(drop.id);
      toast.success(`Drop ${drop.id} has been deleted.`);
    }
  };

  return (
    <div className='dashboard__tile'>
      <div className='dashboard__tile-img'>
        <BaseMedia src={drop.bannerImageS3Path} />
      </div>
      <div className='dashboard__tile-details'>
        <div className='dashboard__tile-artist-pfp'>
          <PfpImage src={drop.NftContract.Artist.profilePicture} />
        </div>
        <div className='dashboard__tile-artist-info'>
          <div className='dashboard__tile-nft-name'>{drop.name}</div>
          <div className='dashboard__tile-artist-name'>
            by {drop.NftContract.Artist.username || 'anon'}
          </div>
        </div>
      </div>
      <button
        onClick={handleApproveBtnClick}
        disabled={isDeploying || isDeleting}
        className='nft-tile__claimbutton'
        style={{ width: '100%', display: 'inline-block', height: '50px' }}
      >
        {isDeploying ? <LoaderSpinner /> : 'approve & deploy drop'}
      </button>
      <button
        onClick={handleDeleteBtnClick}
        disabled={isDeploying || isDeleting}
        className='btn-get-tickets'
        style={{ width: '100%', display: 'inline-block', height: '50px' }}
      >
        {isDeleting ? <LoaderSpinner /> : 'delete drop'}
      </button>
    </div>
  );
}
