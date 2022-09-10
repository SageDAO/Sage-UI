import { Props as ModalProps } from '@/components/Modals/index';
import Logotype from '@/components/Logotype';
import Wallet from '@/components/Wallet';
import { useRouter } from 'next/router';
import useWindowDimensions from '@/hooks/useWindowSize';
import Socials from '@/components/Socials';
import ASHPrice from '../ASHPrice';
import MenuToggle from './MenuToggle';
import Copyright from '../Branding/Copyright';

interface Props extends ModalProps {
  toggleMenu: any;
}

interface NavLink {
  name: string;
  url: string;
}

const navLinks: NavLink[] = [
  {
    name: 'Home',
    url: '/',
  },
  {
    name: 'Drops',
    url: '/drops',
  },
  {
    name: 'Apply',
    url: '/creators/submissions',
  },
];

export default function MobileMenu({ isOpen, closeModal, toggleMenu }: Props) {
  const router = useRouter();
  const { isMobile } = useWindowDimensions();

  if (!isMobile) return null;

  return (
    <div className='mobile-menu' data-is-open={isOpen}>
      <MenuToggle isOpen={isOpen} toggleMobileMenu={toggleMenu} />
      <div className='mobile-menu__ash-price-container-wrapper'>
        <div className='mobile-menu__ash-price-container'>
          <ASHPrice />
        </div>
      </div>
      <div className='mobile-menu__logotype'>
        <Logotype></Logotype>
      </div>
      <section className='mobile-menu__nav'>
        {navLinks.map((l) => {
          async function handleClick() {
            await router.push(l.url);
            closeModal();
          }
          const isCurrent: boolean = router.pathname === l.url;
          return (
            <div
              onClick={handleClick}
              key={l.name}
              data-is-current={isCurrent}
              className='mobile-menu__nav-item'
            >
              {l.name}
            </div>
          );
        })}
      </section>
      <Wallet closeModal={closeModal} isOpen={isOpen}></Wallet>
      <section className='mobile-menu__socials'>
        <h1 className='mobile-menu__socials-header'>follow us on</h1>
        <div className='mobile-menu__socials-icons'>
          <Socials></Socials>
        </div>
      </section>
      <h1 className='mobile-menu__copyright'>
        <Copyright></Copyright>
      </h1>
    </div>
  );
}
