import { PfpImage } from './Media/BaseMedia';
import { useConnect } from 'wagmi';
import { Props as ModalProps } from '@/components/Modals';
import Image from 'next/image';
import PersonalizedMessage from './PersonalizedMessage';
import useSignIn from '@/hooks/useSignIn';
import WalletConnectSVG from '@/public/icons/walletconnect.svg';
import MetamaskSVG from '@/public/icons/metamask.svg';
import useSAGEAccount from '@/hooks/useSAGEAccount';
import useSageRoutes from '@/hooks/useSageRoutes';

interface Props {
  closeModal?: ModalProps['closeModal'];
  isOpen: ModalProps['isOpen'];
}

export default function Wallet({ closeModal, isOpen }: Props) {
  const {
    isSignedIn,
    isWalletConnected,
    isWalletConnecting,
    userData,
    ashBalanceDisplay,
    pointsBalanceDisplay,
    connect,
    connectors,
  } = useSAGEAccount();
  const { pushToProfile } = useSageRoutes();
  const showWalletSelection: boolean = Boolean(!isWalletConnected);
  const showAuthSection: boolean = Boolean(isWalletConnected && isSignedIn);
  useSignIn(isOpen);

  return (
    <div className='wallet'>
      <div className='wallet__user-section-wrapper'>
        <section className='wallet__header'>
          <h1 className='wallet__header-prompt'>
            <PersonalizedMessage></PersonalizedMessage>
          </h1>
          {showWalletSelection && (
            <h1 className='wallet__header-info'>
              By connecting your wallet, you agree
              <pre />
              to our terms of service and privacy policy.
            </h1>
          )}
        </section>
        {showWalletSelection && (
          <section className='wallet__wallets '>
            {connectors.map((c) => {
              function onClick() {
                connect({ connector: c });
              }
              const className = `wallet__wallet-item wallet__${c.name}`;
              if (!c.ready) return null;
              return (
                <button
                  className={className}
                  key={c.name}
                  disabled={isWalletConnecting}
                  data-loading={isWalletConnecting && 'true'}
                  onClick={onClick}
                >
                  {c.name == 'MetaMask' ? (
                    <MetamaskSVG className='wallet__wallet-icon' />
                  ) : (
                    <WalletConnectSVG className='wallet__wallet-icon' />
                  )}
                </button>
              );
            })}
          </section>
        )}
        {showAuthSection && (
          <>
            <section className='wallet__user-section'>
              <div className='wallet__user-pfp-container' onClick={pushToProfile}>
                <PfpImage
                  className='wallet__user-pfp-src'
                  src={userData?.profilePicture}
                ></PfpImage>
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
                <h1 className='wallet__token-balance'>
                  ash balance:
                  <span>pixel balance: </span>
                </h1>
                <h1 className='wallet__points-balance'>
                  <span className='wallet__points-value'>{ashBalanceDisplay}</span>
                  <span className='wallet__points-value'>{pointsBalanceDisplay}</span>
                </h1>
              </div>
              {isSignedIn && (
                <button onClick={pushToProfile} className='wallet__interact-button'>
                  PROFILE
                </button>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
