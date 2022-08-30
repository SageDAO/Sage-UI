import FooterLogoSVG from '@/public/branding/footer-logo.svg';
import MottoSVG from '@/public/branding/motto.svg';
import Socials from '@/components/Socials';
import { useRouter } from 'next/router';
import { SearchInput } from '../SearchInput';

export default function Footer() {
  const router = useRouter();
  const handleHowToBuyAshClick = (e: any) => {
    router.push('/howtobuyash');
    e.preventDefault();
  };

  return (
    <div className='footer' data-cy='footer'>
      <div className='footer__content'>
        <div className='footer__top'>
          <div className='footer__top-content'>
            <div className='footer__logo'>
              <FooterLogoSVG className='footer__logo-svg'></FooterLogoSVG>
            </div>
            <div className='searchform'>
              <SearchInput placeholder="search sage" displayIcon={true} className='searchform__input'></SearchInput>
            </div>
          </div>
        </div>
        <div className='footer__middle'>
          <ul className='footer__middle-item'>
            <div className='footer__middle-item-header'>contact sage</div>
            <div className='footer__middle-item-content'>
              <h1 className='footer__middle-item-content-link'>
                <a href='mailto:contact@sage.art'>apply for artists</a>
              </h1>
              <h1 className='footer__middle-item-content-link'>
                <a href='mailto:contact@sage.art'>business inquiry</a>
              </h1>
              <h1 className='footer__middle-item-content-link'>
                <a href='mailto:contact@sage.art'>support</a>
              </h1>
            </div>
          </ul>
          <ul className='footer__middle-item'>
            <div className='footer__middle-item-header'>token + lp</div>
            <div className='footer__middle-item-content'>
              <div className='footer__middle-item-content-link'>
                <a href='/howtobuyash' onClick={handleHowToBuyAshClick}>
                  how to buy ash
                </a>
              </div>
            </div>
          </ul>
          <ul className='footer__middle-item'>
            <div className='footer__middle-item-header'>press</div>
            <div className='footer__middle-item-content'>
              <h1 className='footer__middle-item-content-link'>
                <a href='/press'>sage press</a>
              </h1>
            </div>
          </ul>
          <ul className='footer__follow'>
            <div className='footer__middle-item-header'>follow us on</div>
            <div className='footer__middle-item-content'>
              <Socials></Socials>
            </div>
          </ul>
        </div>
        <div className='footer__bottom'>
          <h4 className='footer__copyright'>SAGE™️ - ALL RIGHTS RESERVED 2022</h4>
        </div>
        <MottoSVG className='footer__motto' />
      </div>
    </div>
  );
}
