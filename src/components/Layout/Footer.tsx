import { BaseMedia } from '@/components/Media';
import Socials from '@/components/Socials';
import Image from 'next/image';
export default function Footer() {
  return (
    <div className='footer' data-cy='footer'>
      <div className='footer__top'>
        <div className='footer__logo'>
          <BaseMedia isVideo={false} src='/branding/footer-logo.svg' />
        </div>
      </div>
      <div className='footer__middle'>
        <ul className='footer__middle-item'>
          <li className='footer__middle-item-header'>contact sage</li>
          <li className='footer__middle-item-content'>
            <li className='footer__middle-item-content-link'>apply for artists</li>
            <li className='footer__middle-item-content-link'>business inquiry</li>
            <li className='footer__middle-item-content-link'>support</li>
          </li>
        </ul>
        <ul className='footer__middle-item'>
          <li className='footer__middle-item-header'>token + lp</li>
          <li className='footer__middle-item-content'>
            <li className='footer__middle-item-content-link'>how to buy ash</li>
          </li>
        </ul>
        <ul className='footer__follow'>
          <li className='footer__middle-item-header'>follow us on</li>
          <li className='footer__middle-item-content'>
            <Socials></Socials>
          </li>
        </ul>
      </div>
      <div className='footer__bottom'>
        <h4 className='footer__copyright'>SAGE™️ - ALL RIGHTS RESERVED 2022</h4>
      </div>
      <div className='footer__destroying-fakes'>
        <Image draggable={false} src='/branding/destroying-fakes.svg' width={12} height={194} />
      </div>
    </div>
  );
}
