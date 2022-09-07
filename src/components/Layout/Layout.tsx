import type { Router } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '@/components/Layout/Nav';
import Footer from '@/components/Layout/Footer';
import useWatchNetwork from '@/hooks/useWatchNetwork';
import WrongNetworkModal from '@/components/Modals/WrongNetworkModal';
import React, { useEffect, useRef } from 'react';
import HiddenMenu from './HiddenMenu';
import MobileMenu from '@/components/Mobile/MobileMenu';
import MenuToggle from '@/components/Mobile/MenuToggle';
import useModal from '@/hooks/useModal';
import { useSession } from 'next-auth/react';
import { useAccount, useDisconnect } from 'wagmi';
import { useSignOutMutation } from '@/store/usersReducer';
import { animated, useTransition, config } from 'react-spring';
import SageIconSVG from '@/public/branding/sage-icon.svg';

type Props = {
  children: JSX.Element[] | JSX.Element;
  router: Router;
};

export default function Layout({ children, router }: Props) {
  const {
    isNetworkModalOpen,
    closeNetworkModal,
    switchToCorrectNetwork,
    isLoading: isChangingNetwork,
  } = useWatchNetwork();

  const layoutEl = useRef<HTMLDivElement>(null);

  const { data: sessionData } = useSession();
  const { data: wagmiData } = useAccount();
  const [signOut] = useSignOutMutation();
  const { disconnect } = useDisconnect();

  const transitions = useTransition(router.pathname, {
    from: { translateY: 100 },
    enter: { translateY: 0 },
    config: config.default,
    exitBeforeEnter: true,
  });

  useEffect(() => {
    if (sessionData && wagmiData && sessionData.address != wagmiData.address) {
      signOut();
      disconnect();
      router.push('/');
    }
  }, [sessionData, wagmiData]);

  const {
    closeModal: closeMobileMenu,
    isOpen: isMobileMenuOpen,
    toggleModal: toggleMobileMenu,
  } = useModal(true);

  return transitions((props, item) => {
    return (
      <React.Fragment>
        <MobileMenu
          isOpen={isMobileMenuOpen}
          toggleMenu={toggleMobileMenu}
          closeModal={closeMobileMenu}
        ></MobileMenu>
        <WrongNetworkModal
          isOpen={isNetworkModalOpen}
          closeModal={closeNetworkModal}
          switchToCorrectNetwork={switchToCorrectNetwork}
          isLoading={isChangingNetwork}
        />
        <ToastContainer
          position='bottom-center'
          autoClose={5000}
          icon={SageIconSVG}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          limit={3}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          data-cy='toast-container'
        />
        <div ref={layoutEl} key={router.route} className='layout'>
          <Nav />
          <MenuToggle
            isDynamicColors={true}
            isOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
          {children}
          <Footer></Footer>
        </div>
      </React.Fragment>
    );
  });
}
