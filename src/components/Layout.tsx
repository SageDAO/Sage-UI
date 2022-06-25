import Head from 'next/head';
import type { Router } from 'next/router';
import variants from '@/animations/index';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import useWatchNetwork from '@/hooks/useWatchNetwork';
import WrongNetworkModal from './Modals/WrongNetworkModal';

type Props = {
  children: JSX.Element[] | JSX.Element;
  router: Router;
};

export default function Layout({ children, router }: Props) {
  // const {
  //   isNetworkModalOpen,
  //   closeNetworkModal,
  //   switchToCorrectNetwork,
  //   isLoading: isChangingNetwork,
  // } = useWatchNetwork();

  return (
    <div className='layout' data-cy='layout'>
      <Head>
        <title>Sage Marketplace</title>
        <link rel='icon' href='/' />
      </Head>
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
      <motion.div
        key={router.route}
        initial='pageInitial'
        animate='pageAnimate'
        exit='pageInitial'
        variants={variants}
        id='main'
      >
        {children}
      </motion.div>
    </div>
  );
}
