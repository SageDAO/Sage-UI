import Modal, { Props as ModalProps } from '@/components/Modals';
import { Drop_include_GamesAndArtist } from '@/prisma/types';

interface NewDropDetailsModalProps extends ModalProps {
  drop: Drop_include_GamesAndArtist;
}

export function NewDropDetailsModal({ isOpen, closeModal, drop }: NewDropDetailsModalProps) {
  return (
    <Modal title='Drop Details' isOpen={isOpen} closeModal={closeModal}>
      <div className='dashboard__user-details-modal'>
        <div style={{ textAlign: 'center' }}>
          <div>
            <div style={{ fontWeight: 'bolder' }}>{drop.name}</div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
