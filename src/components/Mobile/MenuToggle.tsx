import useModal from '@/hooks/useModal';
import useWindowDimensions from '@/hooks/useWindowSize';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

interface Props {
  toggleMobileMenu: ReturnType<typeof useModal>['toggleModal'];
  isOpen: boolean;
  isDynamicColors?: boolean;
}

export default function MenuToggle({ toggleMobileMenu, isOpen, isDynamicColors }: Props) {
  const { isMobile } = useWindowDimensions();
  const router = useRouter();
  const isSingleDropPage: boolean = useMemo(() => {
    if (!isDynamicColors) return false;
    const isSingleDropPage = router.pathname.includes('/drops/');
    return isSingleDropPage;
  }, [router.pathname]);
  if (isMobile) {
    return (
      <div onClick={toggleMobileMenu} className='mobile-menu__toggle'>
        <div className='mobile-menu__toggle-inner'>
          <div
            data-bg-color={isSingleDropPage && 'white'}
            className='mobile-menu__toggle-line1'
            data-is-open={isOpen}
          ></div>
          <div
            data-bg-color={isSingleDropPage && 'white'}
            className='mobile-menu__toggle-line2'
            data-is-open={isOpen}
          ></div>
          <div
            data-bg-color={isSingleDropPage && 'white'}
            className='mobile-menu__toggle-line3'
            data-is-open={isOpen}
          ></div>
        </div>
      </div>
    );
  }

  return null;
}
