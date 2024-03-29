import useModal from '@/hooks/useModal';
import { Drop_include_GamesAndArtist } from '@/prisma/types';
import { useApproveAndDeployDropMutation, useDeleteDropMutation } from '@/store/dropsReducer';
import { Signer } from 'ethers';
import { toast } from 'react-toastify';
import { useSigner } from 'wagmi';
import LoaderSpinner from '../LoaderSpinner';
import { BaseMedia, PfpImage } from '../Media/BaseMedia';
import { NewDropDetailsModal } from './NewDropDetailsModal';

interface Props {
  drop: Drop_include_GamesAndArtist;
}

export default function NewDropCard({ drop }: Props) {
  const { data: signer } = useSigner();
  const [approveAndDeployDrop, { isLoading: isDeploying }] = useApproveAndDeployDropMutation();
  const [deleteDrop, { isLoading: isDeleting }] = useDeleteDropMutation();
  const { isOpen, closeModal, openModal } = useModal();

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
      <NewDropDetailsModal isOpen={isOpen} closeModal={closeModal} drop={drop} />
      <div className='dashboard__tile-img'>
        <BaseMedia src={drop.bannerImageS3Path} onClickHandler={openModal} />
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
        className='dashboard__submit-button'
        style={{ width: '100%', display: 'inline-block', height: '50px' }}
      >
        {isDeploying ? <LoaderSpinner /> : 'approve & deploy drop'}
      </button>
      <button
        onClick={handleDeleteBtnClick}
        disabled={isDeploying || isDeleting}
        className='dashboard__submit-button'
        style={{ width: '100%', display: 'inline-block', height: '50px' }}
      >
        {isDeleting ? <LoaderSpinner /> : 'delete drop'}
      </button>
    </div>
  );
}
