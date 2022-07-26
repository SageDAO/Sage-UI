import SageLogo from '@/public/branding/sage-full-logo.svg';
import MottoSVG from '@/public/branding/motto.svg';
import Socials from '@/components/Socials';
import Image from 'next/image';
export default function Footer() {
  return (
    <div className='footer' data-cy='footer'>
      <div className='footer__top'>
        <div className='footer__logo'>
          <SageLogo className='footer__logo-svg'></SageLogo>
        </div>
      </div>
      <div className='footer__middle'>
        <ul className='footer__middle-item'>
          <div className='footer__middle-item-header'>contact sage</div>
          <div className='footer__middle-item-content'>
            <h1 className='footer__middle-item-content-link'>apply for artists</h1>
            <h1 className='footer__middle-item-content-link'>business inquiry</h1>
            <h1 className='footer__middle-item-content-link'>support</h1>
          </div>
        </ul>
        <ul className='footer__middle-item'>
          <div className='footer__middle-item-header'>token + lp</div>
          <div className='footer__middle-item-content'>
            <div className='footer__middle-item-content-link'>how to buy ash</div>
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
  );
}
