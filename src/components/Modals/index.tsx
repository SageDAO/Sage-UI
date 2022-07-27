import { Dialog } from '@headlessui/react';
import { BaseMedia } from '@/components/Media';
import { motion } from 'framer-motion';
import variants from '@/animations/index';

export interface Props {
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
  title?: string;
}

function index({ closeModal, children, isOpen, title }: Props) {
  return (
    <Dialog open={isOpen} onClose={closeModal} as='div' className='modal'>
      <div className='modal__backdrop' aria-hidden='true' />
      <motion.div
        initial={'modalInitial'}
        animate={'modalAnimate'}
        variants={variants}
        className='modal__container'
      >
        <Dialog.Panel className='modal__panel' as='div'>
          {children}
        </Dialog.Panel>
      </motion.div>
    </Dialog>
  );
}

export default index;
