import Modal, { Props as ModalProps } from '@/components/Modals';
import Wallet from '../Wallet';
import useWindowDimensions from '@/hooks/useWindowSize';
import useSignIn from '@/hooks/useSignIn';
import SageFullLogo from '@/public/branding/sage-full-logo.svg';
import CloseSVG from '@/public/interactive/close.svg';

interface Props extends ModalProps {}

export default function AccountModal({ isOpen, closeModal }: Props) {
  const { isMobile } = useWindowDimensions();

  if (isMobile) return null;

  return (
    <Modal title=''  isOpen={isOpen} closeModal={closeModal}>
      <div className='accountmodal'>
        <section className='games-modal__header'>
          <SageFullLogo className='games-modal__sage-logo' />
          <button className='games-modal__close-button'>
            <CloseSVG onClick={closeModal} className='games-modal__close-button-svg' />
          </button>
        </section>
        <Wallet isOpen={isOpen}></Wallet>
      </div>
    </Modal>
  );
}
