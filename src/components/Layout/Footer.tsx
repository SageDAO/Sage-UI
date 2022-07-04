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
        <div className='footer__middle-item'>
          <div className='footer__middle-item-header'>contact sage</div>
          <div className='footer__middle-item-content'>
            <div className='footer__middle-item-content-link'>apply for artists</div>
            <div className='footer__middle-item-content-link'>business inquiry</div>
            <div className='footer__middle-item-content-link'>get in touch</div>
          </div>
        </div>
        <div className='footer__middle-item'>
          <div className='footer__middle-item-header'>token + lp</div>
          <div className='footer__middle-item-content'>
            <div className='footer__middle-item-content-link'>ash nft contract address</div>
            <div className='footer__middle-item-content-link'>ash token information</div>
            <div className='footer__middle-item-content-link'>eth/ash on uniswap</div>
          </div>
        </div>
        <div className='footer__middle-item'>
          <div className='footer__middle-item-header'>follow us on</div>
          <div className='footer__middle-item-content'>
            <Socials></Socials>
          </div>
        </div>
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
