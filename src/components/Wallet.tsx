import { BaseMedia, PfpImage } from './Media';
import {
  useConnect,
  useAccount,
  useSignMessage,
  useNetwork,
  useDisconnect,
  Connector,
  useBalance,
} from 'wagmi';
import { SiweMessage } from 'siwe';
import Modal, { Props as ModalProps } from '@/components/Modals';
import type { Dispatch, SetStateAction } from 'react';
import Loader from 'react-loader-spinner';
import shortenAddress from '@/utilities/shortenAddress';
import { getCsrfToken, useSession } from 'next-auth/react';
import { useGetUserQuery, useSignInMutation, useSignOutMutation } from '@/store/usersReducer';
import Image from 'next/image';
import { parameters } from '@/constants/config';
import { useRouter } from 'next/router';

interface Props {
  closeModal?: ModalProps['closeModal'];
}

export default function Wallet({ closeModal }: Props) {
  const { data: accountData } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: userData } = useGetUserQuery();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { connectors, connectAsync, activeConnector, isConnecting, isConnected } = useConnect();
  const { data: balanceData } = useBalance({
    token: parameters.ASHTOKEN_ADDRESS,
    addressOrName: sessionData?.address as string,
  });
  const [signIn] = useSignInMutation();
  const [signOut] = useSignOutMutation();
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage();
  const { activeChain } = useNetwork();
  const router = useRouter();

  async function goToProfile() {
    await router.push('/profile');
    if (closeModal) closeModal();
  }

  const showWalletSelection: boolean = Boolean(!accountData);
  const showAuthSection: boolean = Boolean(accountData);
  const showSignOutButton: boolean = Boolean(sessionStatus === 'authenticated');
  const showSignInButton: boolean = Boolean(sessionStatus !== 'authenticated');

  async function handleConnectClick(c: Connector<any, any>) {
    try {
      await connectAsync(c);
    } catch {}
  }

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

  async function handleSignOutClick() {
    signOut(null);
    disconnect();
  }

  return (
    <div className='wallet'>
      <section className='wallet__header'>
        <h1 className='wallet__header-prompt'>connect</h1>
        <h1 className='wallet__header-info'>
          SELECT YOUR WALLET YOU WANT TO CONNECT. REMEMBER SAGE WILL NEVER ASK FOR YOUR SECRET KEYS
          OR ANY CONFIDENTIAL INFO.
        </h1>
      </section>

      {showWalletSelection && (
        <section className='wallet__wallets'>
          <button
            className='wallet__wallet-item'
            disabled={isConnecting}
            onClick={() => {
              const c = connectors[0];
              handleConnectClick(c);
            }}
          >
            <div className='wallet__wallet-icon'>
              <Image src='/icons/metamask.svg' width={120} height={120}></Image>
            </div>
            <h1 className='wallet__wallet-name'>metamask</h1>
          </button>
          <button
            className='wallet__wallet-item'
            disabled={isConnecting}
            data-loading={isConnecting && 'true'}
            onClick={async () => {
              const c = connectors[1];
              handleConnectClick(c);
            }}
          >
            <div className='wallet__wallet-icon'>
              <Image src='/icons/walletconnect.svg' height={103.5} width={120}></Image>
            </div>
            <h1 className='wallet__wallet-name'>walletconnect</h1>
          </button>
        </section>
      )}
      {showAuthSection && (
        <section className='wallet__auth'>
          {showSignInButton && (
            <button
              className='wallet__auth-sign-in-button'
              onClick={handleSignInClick}
              disabled={isSigningMessage}
              data-loading={isSigningMessage && 'true'}
            >
              <svg
                className='wallet__auth-ethereum-icon'
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
            <button className='wallet__auth-sign-out-button' onClick={handleSignOutClick}>
              Sign Out
            </button>
          )}
        </section>
      )}

      {sessionStatus === 'authenticated' && sessionData !== null && (
        <>
          <section className='wallet__user-section'>
            <div className='wallet__user-pfp-container' onClick={goToProfile}>
              <PfpImage className='wallet__user-pfp-src' src={userData?.profilePicture}></PfpImage>
            </div>
            <div className='wallet__user-connection-inidicator'></div>
            <div className='wallet__user-metamask-container'>
              <Image
                layout='fill'
                className='wallet__user-metamask-src'
                src={'/icons/metamask.svg'}
              ></Image>
            </div>
          </section>
          <section className='wallet__utils-section'>
            <div className='wallet__utils-info'>
              <h1 className='wallet__points-balance'>pixel balance: </h1>
              <h1 className='wallet__token-balance'>ash balance: {balanceData?.formatted}</h1>
            </div>
            <button onClick={goToProfile} className='wallet__profile-button'>
              go to profile
            </button>
          </section>
        </>
      )}
    </div>
  );
}
