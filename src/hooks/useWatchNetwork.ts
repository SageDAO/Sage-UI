import { useNetwork } from 'wagmi';
import { useEffect, useState } from 'react';
import { parameters } from '@/constants/config';
import { toast } from 'react-toastify';
import useModal from './useModal';
import { switchNetwork } from '@wagmi/core';

export default function useWatchNetwork() {
  const [isLoading, setIsLoading] = useState(false);
  const { activeChain } = useNetwork();
  const {
    isOpen: isNetworkModalOpen,
    openModal: openNetworkModal,
    closeModal: closeNetworkModal,
  } = useModal();

  function switchToCorrectNetwork() {
    setIsLoading(true);
    switchNetwork({ chainId: +parameters.CHAIN_ID })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => setIsLoading(false));
  }

  function handleIncorrectNetwork() {
    if (!activeChain) return;
    if (activeChain.id !== +parameters.CHAIN_ID) {
      toast.warn('incorrect network!', {
        toastId: 'networkChange',
        autoClose: false,
        closeOnClick: false,
        closeButton: false,
        onClick: () => {
          openNetworkModal();
        },
      });
    } else {
      toast.update('networkChange', {
        type: 'success',
        autoClose: 3000,
        render: `Switched to ${parameters.NETWORK_NAME}`,
      });
      closeNetworkModal();
    }
  }

  //handle user on incorrect network
  useEffect(() => {
    handleIncorrectNetwork();
  }, [activeChain?.id]);

  return { isNetworkModalOpen, closeNetworkModal, switchToCorrectNetwork, isLoading };
}
