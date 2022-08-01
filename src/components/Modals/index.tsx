import { Dialog } from '@headlessui/react';

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
      <div
        className='modal__container'
      >
        <Dialog.Panel className='modal__panel' as='div'>
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

export default index;
