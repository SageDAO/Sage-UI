import { PfpImage } from './Media/BaseMedia';
import CloseSVG from '@/public/interactive/close.svg';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import Modal, { Props as ModalProps } from '@/components/Modals';
import { useDisconnect } from 'wagmi';
import Image from 'next/image';
import PersonalizedMessage from './PersonalizedMessage';
import useSignIn from '@/hooks/useSignIn';
import WalletConnectSVG from '@/public/icons/walletconnect.svg';
import MetamaskSVG from '@/public/icons/metamask.svg';
import useSAGEAccount from '@/hooks/useSAGEAccount';
import useSageRoutes from '@/hooks/useSageRoutes';
import ProfileDisplay from './ProfileDisplay';
import { useSignOutMutation } from '@/store/usersReducer';
import useWindowDimensions from '@/hooks/useWindowSize';

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
  const { pushToProfile, pushToMintCreation, pushToCollection, pushToHome } = useSageRoutes();
  const showWalletSelection: boolean = Boolean(!isWalletConnected);
  const showAuthSection: boolean = Boolean(isWalletConnected && isSignedIn);
  const [signOut] = useSignOutMutation();
  const { isSigningMessage } = useSignIn(isOpen);
  const { disconnect } = useDisconnect();
  const { isMobile } = useWindowDimensions();

  async function handleSignOut() {
    signOut();
    disconnect();
    pushToHome();
    closeModal();
  }

  return (
    <div data-hide={isWalletConnected && !isSignedIn && !isOpen} className='wallet__wrapper'>
      <section className='wallet__header'>
        <SageFullLogo className='games-modal__sage-logo' />
        <button className='games-modal__close-button'>
          <CloseSVG onClick={closeModal} className='games-modal__close-button-svg' />
        </button>
      </section>
      <div className='wallet'>
        <div className='wallet__user-section-wrapper'>
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
                    {c.name == 'MetaMask' && (
                      <>
                        <MetamaskSVG className='wallet__wallet-icon' />
                      </>
                    )}

                    {c.name == 'WalletConnect' && (
                      <>
                        <WalletConnectSVG className='wallet__wallet-icon' />
                      </>
                    )}
                    <p className='wallet__wallet-item-name'>
                      {c.name}
                      <span className='wallet__agreement-text'>
                        BY CONNECTING YOUR WALLET, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY
                        POLICY.
                      </span>
                    </p>
                  </button>
                );
              })}
            </section>
          )}
          {/* {Boolean(isWalletConnected && !isSignedIn) && <p>Welcome</p>} */}
          {showAuthSection && (
            <>
              {/* <section className='wallet__user-section'>
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
            </section> */}
              <div className='wallet__user-section'>
                <button
                  onClick={() => {
                    pushToProfile();
                    closeModal();
                  }}
                  className='wallet__user-section-button'
                >
                  YOUR PROFILE
                </button>
                {/* 
              <button onClick={pushToMintCreation} className='wallet__user-section-button'>
                MINT CREATION
              </button>
              <button onClick={pushToCollection} className='wallet__user-section-button'>
                COLLECTION
              </button>

              <button className='wallet__user-section-button'>NOTIFICATIONS</button> */}

                <button onClick={handleSignOut} className='wallet__user-section-logout-button'>
                  LOG OUT
                </button>
              </div>
            </>
          )}

          {showAuthSection && (
            <div className='wallet__profile-display-container'>
              <ProfileDisplay></ProfileDisplay>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
