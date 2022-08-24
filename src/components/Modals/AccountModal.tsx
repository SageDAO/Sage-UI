import Modal, { Props as ModalProps } from '@/components/Modals';
import Wallet from '../Wallet';
import useWindowDimensions from '@/hooks/useWindowSize';
import useSignIn from '@/hooks/useSignIn';

interface Props extends ModalProps {}

export default function AccountModal({ isOpen, closeModal }: Props) {
  const { isMobile } = useWindowDimensions();

  if (isMobile) return null;

  return (
    <Modal title='' isOpen={isOpen} closeModal={closeModal}>
      <Wallet></Wallet>
    </Modal>
  );
}
