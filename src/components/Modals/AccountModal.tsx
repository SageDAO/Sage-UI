import {
  useConnect,
  useAccount,
  useSignMessage,
  useNetwork,
  useDisconnect,
  Connector,
} from 'wagmi';
import { SiweMessage } from 'siwe';
import Modal, { Props as ModalProps } from '@/components/Modals';
import type { Dispatch, SetStateAction } from 'react';
import Loader from 'react-loader-spinner';
import shortenAddress from '@/utilities/shortenAddress';
import { getCsrfToken, useSession } from 'next-auth/react';
import { useSignInMutation, useSignOutMutation } from '@/store/usersReducer';
import { BaseMedia } from '@/components/Media';
import Image from 'next/image';
import Wallet from '../Wallet';
import useWindowDimensions from '@/hooks/useWindowSize';

interface Props extends ModalProps {
}

export default function AccountModal({ isOpen, closeModal }: Props) {
  const { isMobile } = useWindowDimensions();
  if (isMobile) return null;

  return (
    <Modal title='' isOpen={isOpen} closeModal={closeModal}>
      <Wallet></Wallet>
    </Modal>
  );
}
