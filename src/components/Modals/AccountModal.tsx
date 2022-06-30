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
import { useRouter } from 'next/router';
import { useSignInMutation, useSignOutMutation } from '@/store/services/user';
import { BaseMedia } from '../Media';
import Image from 'next/image';

interface Props extends ModalProps {
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export default function AccountModal({ isOpen, closeModal, isLoading, setIsLoading }: Props) {
  const { data: accountData } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { connectors, connectAsync, activeConnector, isConnecting } = useConnect();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [signOut] = useSignOutMutation();
  const { signMessageAsync } = useSignMessage();
  const { activeChain } = useNetwork();
  const router = useRouter();

  const showWalletSelection: boolean = Boolean(!accountData);
  const showAuthSection: boolean = Boolean(accountData);
  const showSignOutButton: boolean = Boolean(sessionStatus === 'authenticated');
  const showSignInButton: boolean = Boolean(sessionStatus !== 'authenticated');

  async function handleSignInClick() {
    try {
      setIsLoading(true);
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
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }

  async function handleSignOutClick() {
    signOut(null);
    disconnect();
  }

  async function handleConnectClick(c: Connector<any, any>) {
    try {
      setIsLoading(true);
      await connectAsync(c);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <Modal title='' isOpen={isOpen} closeModal={closeModal}>
      <div className='accountmodal'>
        <section className='accountmodal__header'>
          <div className='accountmodal__header-sage-logo'>
            <BaseMedia src='/branding/sage-full-logo.svg'></BaseMedia>
          </div>
          <h1 className='accountmodal__header-info'>
            SELECT YOUR WALLET YOU WANT TO CONNECT. REMEMBER SAGE WILL NEVER ASK FOR YOUR SECRET
            KEYS OR ANY CONFIDENTIAL INFO.
          </h1>
          <div className='accountmodal__header-close-button' onClick={closeModal}>
            <BaseMedia src='/interactive/close.svg'></BaseMedia>
          </div>
        </section>

        {showWalletSelection && (
          <section className='accountmodal__wallets'>
            <button
              className='accountmodal__wallet-item'
              disabled={isConnecting}
              onClick={() => {
                const c = connectors[0];
                handleConnectClick(c);
              }}
            >
              <div className='accountmodal__wallet-icon'>
                <Image src='/icons/metamask.svg' width={120} height={120}></Image>
              </div>
              <h1 className='accountmodal__wallet-name'>metamask</h1>
            </button>
            <button
              className='accountmodal__wallet-item'
              disabled={isConnecting}
              onClick={async () => {
                const c = connectors[1];
                handleConnectClick(c);
              }}
            >
              <div className='accountmodal__wallet-icon'>
                <Image src='/icons/walletconnect.svg' height={103.5} width={120}></Image>
              </div>
              <h1 className='accountmodal__wallet-name'>walletconnect</h1>
            </button>
          </section>
        )}
        {showAuthSection && (
          <section className='accountmodal__auth'>
            {showSignInButton && (
              <button
                className='accountmodal__auth-sign-in-button'
                onClick={handleSignInClick}
                disabled={isLoading}
              >
                <svg
                  className='accountmodal__auth-ethereum-icon'
                  width='35'
                  height='58'
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 35 58'
                  fill='none'
                >
                  <path
                    d='M17.4954 0L17.1132 1.29889V38.9897L17.4954 39.3711L34.991 29.0295L17.4954 0Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                  <path
                    d='M17.4956 0L0 29.0295L17.4956 39.3713V21.0773V0Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                  <path
                    d='M17.494 42.6838L17.2786 42.9463V56.3726L17.494 57.0017L35 32.3474L17.494 42.6838Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                  <path
                    d='M17.4956 57.0014V42.6835L0 32.3471L17.4956 57.0014Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                  <path
                    d='M17.4965 39.3711L34.9919 29.0296L17.4965 21.0774V39.3711Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                  <path
                    d='M0 29.0296L17.4954 39.3711V21.0774L0 29.0296Z'
                    fill='white'
                    data-darkreader-inline-fill=''
                  ></path>
                </svg>
                Sign In With Ethereum
              </button>
            )}
            {showSignOutButton && (
              <button className='accountmodal__auth-sign-out-button' onClick={handleSignOutClick}>
                Sign Out
              </button>
            )}
          </section>
        )}
      </div>
    </Modal>
  );
}
