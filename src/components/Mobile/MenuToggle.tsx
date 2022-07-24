import useModal from '@/hooks/useModal';
import useWindowDimensions from '@/hooks/useWindowSize';

interface Props {
  toggleMobileMenu: ReturnType<typeof useModal>['toggleModal'];
  isOpen: boolean;
}

export default function MenuToggle({ toggleMobileMenu, isOpen }: Props) {
  const { isMobile } = useWindowDimensions();
  if (isMobile) {
    return (
      <div onClick={toggleMobileMenu} className='mobile-menu__toggle'>
        <div className='mobile-menu__toggle-inner'>
          <div className='mobile-menu__toggle-line1' data-is-open={isOpen}></div>
          <div className='mobile-menu__toggle-line2' data-is-open={isOpen}></div>
          <div className='mobile-menu__toggle-line3' data-is-open={isOpen}></div>
        </div>
      </div>
    );
  }

  return null;
}
