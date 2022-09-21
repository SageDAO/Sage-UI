import useModal from '@/hooks/useModal';
import useSageRoutes from '@/hooks/useSageRoutes';
import useWindowDimensions from '@/hooks/useWindowSize';

import { SearchInput } from '@/components/SearchInput';

interface Props {
  toggleMobileMenu: ReturnType<typeof useModal>['toggleModal'];
  isOpen: boolean;
  isDynamicColors?: boolean;
  hideSearch?: boolean;
}

export default function MenuToggle({
  toggleMobileMenu,
  hideSearch,
  isOpen,
  isDynamicColors,
}: Props) {
  const { isMobile } = useWindowDimensions();
  const { isSingleDropsPage } = useSageRoutes();
  const dataBgColor = Boolean(isDynamicColors) && isSingleDropsPage && 'white';
  if (isMobile) {
    return (
      <div className='mobile-nav'>
        {!hideSearch && (
          <div className='mobile-nav__search'>
            <div className='searchform'>
              <SearchInput placeholder={'search'} displayIcon={true} className='searchform__input'></SearchInput>
            </div>
          </div>
        )}
        <div onClick={toggleMobileMenu} className='mobile-menu__toggle'>
          <div className='mobile-menu__toggle-inner'>
            <div
              data-bg-color={dataBgColor}
              className='mobile-menu__toggle-line1'
              data-is-open={isOpen}
            ></div>
            <div
              data-bg-color={dataBgColor}
              className='mobile-menu__toggle-line2'
              data-is-open={isOpen}
            ></div>
            <div
              data-bg-color={dataBgColor}
              className='mobile-menu__toggle-line3'
              data-is-open={isOpen}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
