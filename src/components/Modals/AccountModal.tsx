import {
  useConnect,
  useAccount,
  useSignMessage,
  useNetwork,
  useDisconnect,
  Connector,
  useSigner,
} from 'wagmi';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { useEffect } from 'react';
import Wallet from '../Wallet';
import useWindowDimensions from '@/hooks/useWindowSize';
import { toast } from 'react-toastify';
import { getCsrfToken, useSession } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { useSignInMutation } from '@/store/usersReducer';

interface Props extends ModalProps {}

export default function AccountModal({ isOpen, closeModal }: Props) {
  const { isMobile } = useWindowDimensions();
  const { activeChain } = useNetwork();
  const { data: accountData } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [signIn] = useSignInMutation();
  const { isConnected } = useConnect();
  const { status: sessionStatus } = useSession();

  async function handleSignInClick() {
    try {
      const nonce = await getCsrfToken();
      const message = new SiweMessage({
        domain: window.location.host,
        address: accountData?.address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId: activeChain?.id,
        nonce,
      });
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });
      signIn({ message, signature });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    const shouldPromptSignIn: boolean =
      isOpen && isConnected && sessionStatus === 'unauthenticated';
    if (shouldPromptSignIn) {
      handleSignInClick();
    }
  }, [isOpen, isConnected]);

  if (isMobile) return null;

  return (
    <Modal title='' isOpen={isOpen} closeModal={closeModal}>
      <Wallet></Wallet>
    </Modal>
  );
}
