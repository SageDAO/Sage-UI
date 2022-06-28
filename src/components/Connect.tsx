import useModal from '@/hooks/useModal';
import { useSession } from 'next-auth/react';
import AccountModal from '@/components/Modals/AccountModal';
import { useState } from 'react';

export default function Connect() {
  const {
    isOpen: isAccountModalOpen,
    closeModal: closeAccountModal,
    openModal: openAccountModal,
  } = useModal();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { status } = useSession();
  return (
    <button className='connect' onClick={openAccountModal}>
      {status === 'authenticated' && 'connected'}
      {status === 'loading' && 'loading..'}
      {status === 'unauthenticated' && 'connect'}
      <AccountModal
        isOpen={isAccountModalOpen}
        isLoading={isLoading}
        closeModal={closeAccountModal}
        setIsLoading={setIsLoading}
      />
    </button>
  );
}
