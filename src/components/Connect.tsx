import useModal from '@/hooks/useModal';
import { useSession } from 'next-auth/react';
import AccountModal from '@/components/Modals/AccountModal';
import { useAccount } from 'wagmi';
import useSignIn from '@/hooks/useSignIn';

export default function Connect() {
  const {
    isOpen: isAccountModalOpen,
    closeModal: closeAccountModal,
    openModal: openAccountModal,
  } = useModal();

  const { status: sessionStatus } = useSession();
  const { data: accountData } = useAccount();
  let buttonText: string = 'connect';
  let buttonClass: string = 'connect';

  if (accountData) {
    if (sessionStatus === 'authenticated') {
      return null;
    }

    if (sessionStatus === 'unauthenticated') {
      buttonText = 'sign in';
    }
  }

  // useSignIn(isAccountModalOpen);

  return (
    <button className={buttonClass} onClick={openAccountModal}>
      {buttonText}
      <AccountModal isOpen={isAccountModalOpen} closeModal={closeAccountModal} />
    </button>
  );
}
