import Head from 'next/head';
import type { Router } from 'next/router';
import variants from '@/animations/index';
import { motion } from 'framer-motion';
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

  const cursorEl = useRef<HTMLDivElement>(null);
  const layoutEl = useRef<HTMLDivElement>(null);

  const {
    closeModal: closeMobileMenu,
    isOpen: isMobileMenuOpen,
    toggleModal: toggleMobileMenu,
  } = useModal(true);

  useEffect(() => {
    // layoutEl.current?.addEventListener('mousemove', (e) => {
    //   const dataX = String(e.pageX);
    //   const dataY = String(e.pageY);
    //   cursorEl.current?.setAttribute(
    //     'style',
    //     `transform: translate3d(${dataX}px, ${dataY}px, 0px);`
    //   );
    // });
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Sage Marketplace</title>
        <link rel='icon' href='/icons/sage.svg' />
      </Head>
      <MenuToggle isOpen={isMobileMenuOpen} toggleMobileMenu={toggleMobileMenu} />
      <MobileMenu isOpen={isMobileMenuOpen} closeModal={closeMobileMenu}></MobileMenu>
      <WrongNetworkModal
        isOpen={isNetworkModalOpen}
        closeModal={closeNetworkModal}
        switchToCorrectNetwork={switchToCorrectNetwork}
        isLoading={isChangingNetwork}
      />
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        data-cy='toast-container'
      />
      <motion.div ref={layoutEl} key={router.route} className='layout'>
        <HiddenMenu />
        <Nav />
        {children}
        <Footer></Footer>
      </motion.div>
    </React.Fragment>
  );
}
