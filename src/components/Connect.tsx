import useModal from '@/hooks/useModal';
import { useSession } from 'next-auth/react';
import AccountModal from '@/components/Modals/AccountModal';
import { useState } from 'react';
import { useAccount } from 'wagmi';

export default function Connect() {
  const {
    isOpen: isAccountModalOpen,
    closeModal: closeAccountModal,
    openModal: openAccountModal,
  } = useModal();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { status: sessionStatus } = useSession();
  const { data: accountData } = useAccount();
  let buttonText: string = 'connect';

  if (accountData) {
    if (sessionStatus === 'authenticated') {
      buttonText = 'signed in';
    }

    if (sessionStatus === 'unauthenticated') {
      buttonText = 'sign in';
    }
  }

  return (
    <button className='connect' onClick={openAccountModal}>
      {buttonText}
      <AccountModal
        isOpen={isAccountModalOpen}
        isLoading={isLoading}
        closeModal={closeAccountModal}
        setIsLoading={setIsLoading}
      />
    </button>
  );
}
