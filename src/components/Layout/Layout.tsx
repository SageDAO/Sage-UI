import Head from 'next/head';
import type { Router } from 'next/router';
import variants from '@/animations/index';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '@/components/Layout/Nav';
// import Footer from '@/Layout/Footer';
import useWatchNetwork from '@/hooks/useWatchNetwork';
import WrongNetworkModal from '@/components/Modals/WrongNetworkModal';
import Cursor from '@/components/Cursor';
import { useEffect, useRef } from 'react';
import HiddenMenu from './HiddenMenu';

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

  useEffect(() => {
    layoutEl.current?.addEventListener('mousemove', (e) => {
      const dataX = String(e.pageX);
      const dataY = String(e.pageY);
      cursorEl.current?.setAttribute(
        'style',
        `transform: translate3d(${dataX}px, ${dataY}px, 0px);`
      );
    });
  }, []);

  return (
    <div ref={layoutEl} className='layout' data-cy='layout'>
      <Head>
        <title>Sage Marketplace</title>
        <link rel='icon' href='/' />
      </Head>
      <div ref={cursorEl} className='cursor'></div>
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
      <HiddenMenu />
      <Nav />
      <motion.div
        key={router.route}
        initial='pageInitial'
        animate='pageAnimate'
        exit='pageInitial'
        variants={variants}
        className='layout__main'
      >
        {children}
        {/*
        <Footer />
				 * */}
      </motion.div>
    </div>
  );
}
