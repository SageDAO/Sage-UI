import BaseModal, { Props as BaseModalProps } from '@/components/Modals/index';
import { parameters } from '@/constants/config';
import { useNetwork } from 'wagmi';

interface Props extends BaseModalProps {
  switchToCorrectNetwork: () => void;
  isLoading: boolean;
}

export default function WrongNetworkModal({
  isOpen,
  closeModal,
  switchToCorrectNetwork,
  isLoading,
}: Props) {
  const network = useNetwork();
  return (
    <BaseModal isOpen={isOpen} closeModal={closeModal} title='Wrong Network'>
      <div className='wrong-network-modal'>
        <h1>You are on {network.activeChain?.name}</h1>
        <h1>Switch to {parameters.NETWORK_NAME}</h1>
				<h1>to use the App</h1>
        <button
          disabled={isLoading}
          className='wrong-network-modal__button'
          onClick={switchToCorrectNetwork}
        >
          {isLoading ? 'pending...' : 'switch network'}
        </button>
      </div>
    </BaseModal>
  );
}
