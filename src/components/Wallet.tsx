import { PfpImage } from './Media/BaseMedia';
import { useGetPointsBalanceQuery } from '@/store/pointsReducer';
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
import { Props as ModalProps } from '@/components/Modals';
import { getCsrfToken, useSession } from 'next-auth/react';
import { useGetUserQuery, useSignInMutation, useSignOutMutation } from '@/store/usersReducer';
import Image from 'next/image';
import { parameters } from '@/constants/config';
import { useRouter } from 'next/router';
import PersonalizedMessage from './PersonalizedMessage';

interface Props {
  closeModal?: ModalProps['closeModal'];
}

export default function Wallet({ closeModal }: Props) {
  const { data: accountData } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: userData } = useGetUserQuery(undefined, {
    skip: !sessionData,
  });
  const { connectors, connectAsync, activeConnector, isConnecting, isConnected } = useConnect();
  const { data: pointsBalance } = useGetPointsBalanceQuery(undefined, {
    skip: !sessionData,
  });
  const { data: walletBalance } = useBalance({
    token: parameters.ASHTOKEN_ADDRESS,
    addressOrName: sessionData?.address as string,
  });
  const ashBalance = Number(walletBalance?.formatted);

  const [signIn] = useSignInMutation();
  const [signOut] = useSignOutMutation();
  const { signMessageAsync, isLoading: isSigningMessage } = useSignMessage();
  const { activeChain } = useNetwork();
  const isSignedIn = sessionStatus === 'authenticated';
  const router = useRouter();

  async function goToProfile() {
    await router.push('/profile');
    if (closeModal) closeModal();
  }

  const showWalletSelection: boolean = Boolean(!isConnected);
  const showAuthSection: boolean = Boolean(accountData);

  async function handleConnectClick(c: Connector<any, any>) {
    try {
      await connectAsync(c);
    } catch {}
  }

  return (
    <div className='wallet'>
      <section className='wallet__header'>
        <h1 className='wallet__header-prompt'>
          <PersonalizedMessage></PersonalizedMessage>
        </h1>
        {showWalletSelection && (
          <h1 className='wallet__header-info'>
            SELECT YOUR WALLET YOU WANT TO CONNECT. REMEMBER SAGE WILL NEVER ASK FOR YOUR SECRET
            KEYS OR ANY CONFIDENTIAL INFO.
          </h1>
        )}
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
      {showAuthSection && <section className='wallet__auth'></section>}

      {isConnected && (
        <>
          <section className='wallet__user-section'>
            <div className='wallet__user-pfp-container' onClick={goToProfile}>
              <PfpImage className='wallet__user-pfp-src' src={userData?.profilePicture}></PfpImage>
            </div>
            <div className='wallet__user-connection-indicator'></div>
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
              <h1 className='wallet__points-balance'>
                pixel balance: <span className='wallet__points-value'>{pointsBalance}</span>
              </h1>
              <h1 className='wallet__token-balance'>
                ash balance:
                <span className='wallet__token-value'>
                  {!isNaN(ashBalance) && ashBalance.toFixed(4)}
                </span>
              </h1>
            </div>
            {isSignedIn && (
              <button onClick={goToProfile} className='wallet__interact-button'>
                go to profile
              </button>
            )}
          </section>
        </>
      )}
    </div>
  );
}
